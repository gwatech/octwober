import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { COLOR } from '#utils/Constants';

export default class LastNumberCommand extends Command {
    public constructor() {
        super('lastnumber', {
            aliases: ['lastnumber', 'ln'],
            category: 'games',
            description: {
                content: 'Shows you the last number entered in the counting channel'
            }
        });
    }

    public exec(message: Message) {
        if (message.channel.id !== '777473504060768316') return;

        const { num, lastUser } = this.client.settings.get<T>(message.guild!, 'counting', {
            num: 0,
            lastUser: undefined
        });

        if (num === 0 || !lastUser) {
            return message.inlineReply('No last entered number was found. Start couting from **1**.');
        }

        const user = this.client.users.cache.get(lastUser!);

        return message.util?.send({
            embed: {
                color: 'COLOR',
                description: `The last number was \`${num}\`${user ? ` entered by **${user}**` : ''} `
            }
        });
    }
}

interface T {
    num: number;
    lastUser: string | undefined
}