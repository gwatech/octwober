import { Command } from 'discord-akairo';
import { Message, TextChannel } from 'discord.js';
import ms from 'ms';

export default class SlowmodeCommand extends Command {
    public constructor() {
        super('slowmode', {
            aliases: ['slowmode'],
            category: 'mod',
            channel: 'guild',
            clientPermissions: ['MANAGE_CHANNELS', 'MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_CHANNELS'],
            args: [
                {
                    id: 'time',
                    match: 'content',
                    type: 'string',
                    prompt: {
                        start: 'Enter the slowmode time'
                    }
                },
            ],
            description: {
                content: 'Setting the slowmode for the current channel',
                usage: '<time>',
                examples: ['6h']
            }
        });
    }

    public async exec(message: Message, { time }: { time: string }) {
        const msTime = Math.min(21600 * 1000, ms(time));

        try {
            await (message.channel as TextChannel).setRateLimitPerUser(msTime / 1000);
        } catch (err) {
            return message.inlineReply(`Could not set the slowmode for this channel!`);
        }

        return message.inlineReply(`Successfully set the slowmode to \`${ms(msTime, { long: true })}\``);
    }
}
