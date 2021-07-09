import { Command } from 'discord-akairo';
import { Message, GuildMember, TextChannel } from 'discord.js';
import { stripIndents } from 'common-tags';
import { COLOR } from '#utils/Constants';

export default class PurgeCommand extends Command {
    private readonly maxAge = 7 * 24 * 60 * 60 * 1000;

    public constructor() {
        super('purge', {
            aliases: ['purge', 'clear'],
            category: 'mod',
            channel: 'guild',
            clientPermissions: ['MANAGE_MESSAGES', 'USE_EXTERNAL_EMOJIS'],
            userPermissions: ['MANAGE_MESSAGES'],
            args: [
                {
                    id: 'count',
                    match: 'phrase',
                    type: 'string'
                },
                {
                    id: 'user',
                    match: 'phrase',
                    type: 'member'
                }
            ],
            description: {
                content: 'Purge messages in the current channel',
                usage: '<amount> [user]',
                examples: ['10', '10 @Ayush#5234']
            }
        });
    }

    public async exec(message: Message, { count, user }: { count: string | null; user: GuildMember | null }) {
        const amount = Number(count);
        if (isNaN(amount)) return message.util!.send(`You must specify an amount!`);
        if (amount > 100 || amount < 1) {
            return message.util!.send(`The minimum amout is 1 and the maximum is 100!`);
        }

        const fetched = await message.channel.messages.fetch({ limit: 100 }, false).catch(() => null);
        if (!fetched) return;
        let messages = [];
        if (user) {
            messages = fetched
                .filter(
                    (msg) =>
                        msg.author.id === user.id &&
                        new Date().getTime() - new Date(msg.createdAt).getTime() <= this.maxAge
                )
                .array()
                .slice(0, amount);
        } else {
            messages = fetched
                .filter((msg) => new Date().getTime() - new Date(msg.createdAt).getTime() <= this.maxAge)
                .array()
                .slice(0, amount);
        }

        try {
            await (message.channel as TextChannel).bulkDelete(messages);
        } catch (err) {
            return message.util!.send(`Failed to purge messages!`);
        }

        await message
            .util!.send(`Successfully deleted **${messages.length}** messages!`)
            .then((msg) => msg.delete({ timeout: 3000 }));

        const embed = this.client.util
            .embed()
            .setColor(COLOR)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(
                stripIndents`
                **Action:** MESSAGES PURGED
                **Count:** ${messages.length}
                **Channel:** ${message.channel}
            `
            )
            .setTimestamp();

        return message.guild?.log(
            {
                embeds: [embed.toJSON()]
            },
            'MOD_LOG'
        );
    }
}
