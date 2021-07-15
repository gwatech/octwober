import { GuildMember, TextChannel, Snowflake } from 'discord.js';
import { Listener } from 'discord-akairo';

export default class GuildMemberRemoveListener extends Listener {
    public constructor() {
        super('guildMemberRemove', {
            event: 'guildMemberRemove',
            emitter: 'client',
            category: 'client'
        });
    }

    public async exec(member: GuildMember) {
        const channel = this.client.channels.cache.get('768300525456064533') as TextChannel;

        return member.user.bot
            ? channel.send(`<a:crii:865121425723228171> **${member.user.username}** left the server! Oh it's a bot`)
            : channel.send(
                  `<a:crii:865121425723228171> **${member.user.username}** left the server! ${this.randomMessage()}`
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
