import type { Events } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';
import type { GuildMember, Message } from 'discord.js';

export class UserEvent extends Listener<typeof Events.MessageCreate> {
    public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			event: 'messageCreate'
		});
	}
    public async run(message: Message) {
        await this.level(message);
    }

    private async level(message: Message) {
        if (!message.guild || message.guild.id !== '1056555185914265670' || message.author.bot) return;
        return await this.container.client.levels.giveGuildUserExp(message.member as GuildMember);
    }
}