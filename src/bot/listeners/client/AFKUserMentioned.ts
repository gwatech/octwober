import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import ms from 'ms';

export default class AFKUserMentionedListener extends Listener {

	public constructor() {
		super('afk', {
			event: 'message',
			emitter: 'client',
			category: 'client'
		});
	}

	public async exec(message: Message) {
		const mention = message.mentions.members?.first();

        if (!mention) return;

        const afk = this.client.settings.get<{ afk: boolean; reason: string; started: Date }>(mention.id, 'afk');

        if (afk) return message.inlineReply(`**${mention.user?.tag}** since ${ms(new Date().getTime() - afk.started.getTime())} is in AFK. Reason: \`${afk?.reason}\``);
	}

}