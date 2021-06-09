import { APIMessage, Structures, StringResolvable, MessageOptions, Message } from 'discord.js';

class Msg extends Structures.get('Message') {
    async inlineReply(content: StringResolvable, options?: MessageOptions):  Promise<Message | Message[]> {

        let mentionRepliedUser = typeof ((options || content || {}).allowedMentions || {}).repliedUser === 'undefined' ? true : ((options || content).allowedMentions!).repliedUser;

        const apiMessage: any = content instanceof APIMessage ? content.resolveData() : APIMessage.create(this.channel, content, options!).resolveData();
        Object.assign(apiMessage.data, { message_reference: { message_id: this.id } });

        if (!apiMessage?.data?.allowed_mentions || Object.keys(apiMessage.data.allowed_mentions).length === 0) {
            apiMessage.data.allowed_mentions = {
                parse: ['users', 'roles', 'everyone']
            }
        }

        if (typeof apiMessage.data.allowed_mentions.replied_user === 'undefined') {
            Object.assign(apiMessage.data.allowed_mentions, { replied_user: mentionRepliedUser });
        }

        if (Array.isArray(apiMessage.data.content)) {
            return Promise.all(apiMessage.split().map((x: any) => {
                x.data.allowed_mentions = apiMessage.data.allowed_mentions;
                return x;
            }).map(this.inlineReply.bind(this)));
        }

        const { data, files } = await apiMessage.resolveFiles();
        // @ts-expect-error
        return this.client.api.channels[this.channel.id].messages
            .post({ data, files })
            // @ts-expect-error
            .then((d: any) => this.client.actions.MessageCreate.handle(d).message);
    }

    async lineReplyNoMention(content: StringResolvable, options?: MessageOptions):  Promise<Message | Message[]> {
        const apiMessage: any = content instanceof APIMessage ? content.resolveData() : APIMessage.create(this.channel, content, options!).resolveData();
        Object.assign(apiMessage.data, { message_reference: { message_id: this.id } });

        if (!apiMessage.data.allowed_mentions || Object.keys(apiMessage.data.allowed_mentions).length === 0) {
            apiMessage.data.allowed_mentions = {
                parse: ['users', 'roles', 'everyone']
            }
        }

        Object.assign(apiMessage.data.allowed_mentions, { replied_user: false });

        if (Array.isArray(apiMessage.data.content)) {
            return Promise.all(apiMessage.split().map((x: any) => {
                x.data.allowed_mentions = apiMessage.data.allowed_mentions;
                return x;
            }).map(this.inlineReply.bind(this)));
        }

        const { data, files } = await apiMessage.resolveFiles();
        // @ts-expect-error
        return this.client.api.channels[this.channel.id].messages
            .post({ data, files })
            // @ts-expect-error
            .then((d: any) => this.client.actions.MessageCreate.handle(d).message);
    }
}

Structures.extend('Message', () => Msg);