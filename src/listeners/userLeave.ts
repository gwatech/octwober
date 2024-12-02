import type { Events } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';
import type { GuildMember, TextChannel } from 'discord.js';

export class UserEvent extends Listener<typeof Events.GuildMemberRemove> {
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            event: 'guildMemberRemove'
        });
    }
    public async run(member: GuildMember) {
        const channel = this.container.client.channels.cache.get('1308899975056457759') as TextChannel;

        return member.user.bot
            ? channel.send(`<a:crii:1313060912034484254> **${member.user.globalName!}** left the server! Oh it's a bot`)
            : channel.send(
                `<a:crii:1313060912034484254> **${member.user.globalName!} (${member.user.username})** left the server! ${this.randomMessage()}`
            );
    }

    private randomMessage() {
        const messages: Array<string> = [
            'Who will fill the void?',
            'Moment of silence.',
            'Hope they come back again.',
            "You'll be missed!",
            'Hope they have enjoyed here.'
        ];

        const random: number = this.random(0, messages.length);

        return messages[random];
    }

    private random(min: number = 0, max: number = 10): number {
        return Math.floor(Math.random() * (max - min) + min);
    }


}