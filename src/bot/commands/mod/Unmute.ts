import { Command } from 'discord-akairo';
import { Message, GuildMember } from 'discord.js';

export default class UnmuteCommand extends Command {
    public constructor() {
        super('unmute', {
            aliases: ['unmute'],
            category: 'mod',
            channel: 'guild',
            clientPermissions: ['MANAGE_ROLES', 'MANAGE_MESSAGES', 'USE_EXTERNAL_EMOJIS'],
            userPermissions: ['MANAGE_ROLES'],
            args: [
                {
                    id: 'culprit',
                    match: 'phrase',
                    type: 'member',
                    prompt: {
                        start: 'Who would you like to unmute?',
                        retry: 'An invalid member was entered! Please re-enter a valid member.'
                    }
                },
            ],
            description: {
                content: 'Unmutes a member in the server',
                usage: '<user>',
                examples: ['@Ayush#5234']
            }
        });
    }

    public async exec(message: Message, { culprit }: { culprit: GuildMember; }) {

        const permissionDiff = message.member!.roles.highest.comparePositionTo(culprit.roles.highest);
        if (permissionDiff < 0) {
            return message.inlineReply('You can\'t mute someone with higher role!');
        } else if (permissionDiff === 0) {
            return message.inlineReply('You can\'t mute someone with equal role!');
        }

        const muteDoc = await this.client.cases.mutes.collection.findOne({
            guild: message.guild!.id,
            user_id: culprit.id,
            processed: false
        });

        if (!muteDoc) return message.inlineReply('This member is not muted!');

        await this.client.cases.mutes.trigger(muteDoc);

        return message.inlineReply(`**${culprit.displayName}** was successfully unmuted!`);
    }
}
