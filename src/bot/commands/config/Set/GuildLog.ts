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
        if (!message.guild!.setGuildLogChannel(channel.id))
            return message.util!.send(`I could not set the guild-log channel in ${channel}`);

        await message.util!.send(`Successfully set the guild-log channel in ${channel}`);
	}
}