import { Structures, TextChannel, Webhook, User } from 'discord.js';
import { AkairoClient } from 'discord-akairo';

import { SETTINGS } from '#bot/utils/Constants';

class Guild extends Structures.get('Guild') {
    public webhooks = new Map<string, Webhook>();

    private async getWebhook(logType: keyof typeof SETTINGS) {
        const logChannelId = this.client.settings.get<string>(this.id, SETTINGS[logType as keyof typeof SETTINGS], null);
        if (!this.client.channels.cache.has(logChannelId)) return null;

        const channel = this.client.channels.cache.get(logChannelId) as TextChannel;

        if (this.webhooks.has(`${channel.id}#${logType}`)) return this.webhooks.get(`${channel.id}#${logType}`);

        if (!channel.permissionsFor(channel.guild.me!)?.has(['MANAGE_WEBHOOKS'])) return null;

        const webhooks = await channel.fetchWebhooks();
        if (webhooks.size) {
            const webhook = webhooks.find((hook) => (hook.owner as User).id === this.client.user!.id);
            if (webhook) {
                this.webhooks.set(`${channel.id}#${logType}`, webhook);
                return webhook;
            }
        }

        if (webhooks.size === 10) return null;
        const webhook = await channel.createWebhook(`${this.client.user!.username} - ${logType.replace(/_/g, ' ')}S`, {
            avatar: this.client.user?.displayAvatarURL()
        });
        this.webhooks.set(`${channel.id}#${logType}`, webhook);
        return webhook;
    }

    public setGuildLogChannel(id: string) {
        return this.client.settings.set(this.id, SETTINGS.GUILD_LOG, id);
    }

    public setModLogChannel(id: string) {
        return this.client.settings.set(this.id, SETTINGS.MOD_LOG, id);
    }

    public setMemberLogChannel(id: string) {
        return this.client.settings.set(this.id, SETTINGS.USER_LOG, id);
    }

    public async log(message: any, key: keyof typeof SETTINGS, options?: any) {
        const webhook = await this.getWebhook(key);
        return webhook?.send(message, options);
    }

    public get prefix() {
        return this.client.settings.get<string>(this.id, SETTINGS.PREFIX, '??');
    }
}

Structures.extend('Guild', () => Guild);