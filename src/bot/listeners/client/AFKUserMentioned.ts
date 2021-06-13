import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import ms from 'ms';

export default class AFKUserMentionedListener extends Listener {

	public constructor() {
		super('afkUserMentioned', {
			event: 'message',
			emitter: 'client',
			category: 'client'
		});
	}

	public async exec(message: Message) {
		if (message.author.bot) return;
		const mention = message.mentions.members?.first();

        if (!mention) return;

        const afk = this.client.settings.get<{ afk: boolean; reason: string; started: Date }>(mention.id, 'afk');

        if (afk) return message.inlineReply(`**${mention.user?.tag}** is in AFK since ${ms(new Date().getTime() - afk.started.getTime(), { long: true })}. Reason: \`${afk?.reason}\``);
	}

}