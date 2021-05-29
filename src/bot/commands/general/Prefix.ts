import { Command, Argument } from 'discord-akairo';
import { Message } from 'discord.js';
import { SETTINGS } from '#utils/Constants';

export default class extends Command {

    public constructor() {
        super('prefix', {
            aliases: ['prefix'],
            category: 'utility',
            channel: 'guild',
            quoted: false,
            description: {
                content: 'Displays or changes the prefix of the guild.',
                usage: '[prefix]',
                examples: ['', '!', '?']
            }
        });
    }

    public *args(): any {
        const prefix = yield {
            type: Argument.validate('string', (msg: Message, p) => !/\s/.test(p) && p.length <= 3),
            prompt: {
                retry: 'Please provide a prefix without spaces and less than 3 characters.',
                optional: true
            }
        };

        return { prefix };
    }

    public async exec(message: Message, { prefix }: { prefix: string }) {
        if (!prefix) return message.util?.send(`The current prefix for this guild is \`${message.guild?.prefix}\``);

        if (prefix && !message.member?.permissions.has('MANAGE_GUILD')) {
            return message.util?.send({
                embed: {
                    color: 11642864,
                    description: [
                        `The current prefix for this guild is \`${message.guild?.prefix}\``,
                        'You are missing `Manage Server` to change the prefix.'
                    ]
                }
            });
        }

        await this.client.settings.set(message.guild!, SETTINGS.PREFIX, prefix);

        return message.util?.send({
            embed: {
                color: 11642864,
                description: `The prefix has been set to \`${prefix}\``
            }
        });
    }

}
