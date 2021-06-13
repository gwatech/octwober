import { Message, TextChannel } from 'discord.js';
import { Command } from 'discord-akairo';

export default class extends Command {
	public constructor() {
		super('set-guildlog', {
            clientPermissions: ['VIEW_AUDIT_LOG', 'MANAGE_WEBHOOKS', 'USE_EXTERNAL_EMOJIS', 'MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_GUILD'],
			description: {},
		});
	}

	public *args(msg: Message): unknown {
		const channel = yield {
			type: 'textChannel',
			match: 'phrase',
			default: (msg: Message) => msg.channel
		};

		return { channel };
	}

	public async exec(message: Message, { channel }: { channel: TextChannel }) {
        const log = await message.guild!.setGuildLogChannel(channel.id);
		if (!log) return message.inlineReply(`I could not set the guild-log channel in ${channel}`);

        return message.inlineReply(`Successfully set the guild-log channel in ${channel}`);
	}
}