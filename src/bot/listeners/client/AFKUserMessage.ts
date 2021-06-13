import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import ms from 'ms';

export default class AFKUserMessageListener extends Listener {

	public constructor() {
		super('afkUserMessage', {
			event: 'message',
			emitter: 'client',
			category: 'client'
		});
	}

	public async exec(message: Message) {
        const afk = this.client.settings.get<{ afk: boolean; reason: string; started: Date }>(message.author.id, 'afk');

        if (!afk) return;
        this.client.settings.delete(message.author?.id, 'afk')
        return message.inlineReply(`**I have removed your AFK since you have sent a message. Your AFK duration was: **${ms(new Date().getTime() - afk.started.getTime())}**.`);
        
	}

}