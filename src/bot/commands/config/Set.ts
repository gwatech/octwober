import { Command, Flag } from 'discord-akairo';

export default class ConfigEnableCommand extends Command {
	public constructor() {
		super('set', {
			category: 'config',
			aliases: ['set'],
			clientPermissions: ['EMBED_LINKS'],
			typing: true,
			description: {}
		});
	}

	public *args(): unknown {
		const sub = yield {
			type: [
				['set-modlog', 'modlog', 'mod-log'],
				['set-guildlog', 'guildlog', 'guild-log'],
				['set-memberlog', 'memberlog', 'member-log']
			],
			otherwise: ''
		};

		return Flag.continue(sub);
	}
}