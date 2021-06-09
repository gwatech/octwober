import { Command, Argument } from 'discord-akairo';
import { Message } from 'discord.js';
import { SETTINGS, COLOR } from '#utils/Constants';

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

    // @ts-expect-error
	public regex() {
		return new RegExp(`^<@!?(${this.client.user!.id})>$`, 'i');
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
        if (/^<@!?(\d+)>$/.test(message.content) && !message.mentions.has(this.client.user!.id)) return;
        if (!prefix) return message.inlineReply(`The current prefix for this guild is \`${message.guild?.prefix}\``);

        if (prefix && !message.member?.permissions.has('MANAGE_GUILD')) {
            return message.util?.send({
                embed: {
                    color: COLOR,
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
                color: COLOR,
                description: `The prefix has been set to \`${prefix}\``
            }
        });
    }

}
