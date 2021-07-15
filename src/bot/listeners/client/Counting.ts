import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import { evaluate } from 'mathjs';

export default class CountingListener extends Listener {
    public constructor() {
        super('Counting', {
            event: 'message',
            category: 'client',
            emitter: 'client'
        });
    }

    public async exec(message: Message) {
        if (message.channel.id !== '777473504060768316' || message.author.bot) return;

        let { count, num, lastUser } = this.client.settings.get<T>(message.guild!, 'counting', {
            count: 0,
            num: 0,
            lastUser: undefined
        });

        try {
            count = evaluate(message.content);
        } catch (e) {
            return;
        }

        if (isNaN(count)) return;

        if (num === 0 && (count > 1 || count < 1)) {
            num = 0;
            lastUser = undefined;
            this.client.settings.set(message.guild!, 'counting', {
                num,
                count,
                lastUser
            });
            message.react('864414233986859048');
            return message.channel.send('Incorrect number! The next number is `1`. **No stats have been changed since the current number was 0.**');
        } else if (count === num + 1) {
            if (lastUser && lastUser === message.author.id) {
                message.react('864414233986859048');
                const Lastnum = num;
                lastUser = undefined;
                num = 0;
                this.client.settings.set(message.guild!, 'counting', {
                    num,
                    count,
                    lastUser
                });
                return message.channel.send(`${message.author.toString()} RUINED IT AT \`${Lastnum}\` Next number is \`1\`. **You can't count two numbers in a row.**`);
            }
            lastUser = message.author.id;
            num++;
            this.client.settings.set(message.guild!, 'counting', {
                num,
                count,
                lastUser
            });
            return message.react('865121425723228171');
        } else {
            message.react('864414233986859048');
            const Lastnum: number = num;
            lastUser = undefined;
            num = 0;
            this.client.settings.set(message.guild!, 'counting', {
                num,
                count,
                lastUser
            });
            return message.channel.send(`${message.author} RUINED IT AT \`${Lastnum}\` Next number is \`1\`. **Wrong number.**`);
        }
    }
}

interface T { 
    count: number; 
    num: number; 
    lastUser: string | undefined 
}
