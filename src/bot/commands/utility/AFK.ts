import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class AFKCommand extends Command {
    constructor() {
        super('afk', {
            aliases: ['afk'],
            category: 'utility',
			description: {
				content: 'Set yourself ask AFK.',
				usage: '[reason]',
				examples: ['', 'Very busy']
			},
            args: [
                {
                    id: 'reason',
                    type: 'string',
                    match: 'content',
                    default: 'N/A'
                }
            ],
        });
    }

    async exec(message: Message, { reason }: { reason: string; }) {
        const afkCurrent = this.client.settings.get<{ afk: boolean; reason: string; started: Date }>(message.author.id, 'afk');
        if (afkCurrent?.afk) return;

        await this.client.settings.set(message.author.id, 'afk', { afk: true, reason, started: new Date() });
        
        const nick = await message.member?.setNickname(`AFK | ${message.member.user.username}`).catch(() => null);
    
        return message.inlineReply(stripIndents`
            You are now set as afk with the reason: **${reason}**
            Your AFK status will be cleared when you chat.
            ${!nick ? `\nI was not able to change your nickname since I am missing permissions to do so.` : ''}
        `);
    }
}