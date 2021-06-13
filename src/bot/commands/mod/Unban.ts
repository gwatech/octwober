import { Argument } from 'discord-akairo';
import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import { stripIndents } from 'common-tags';

import { COLLECTION, CASES } from '#utils/Constants';

export default class UnBanCommand extends Command {
    public constructor() {
        super('unban', {
            aliases: ['unban'],
            category: 'mod',
            channel: 'guild',
            clientPermissions: ['BAN_MEMBERS', 'MANAGE_MESSAGES'],
            userPermissions: ['BAN_MEMBERS'],
            args: [
                {
                    id: 'user',
                    type: Argument.union('user', (_, id) => id ? this.client.users.fetch(id).catch(() => null) : null),
                    prompt: {
                        start: 'Whom would you like to unban?',
                        retry: 'Invalid user entered, please try again!'
                    }
                },
                {
                    id: 'reason',
                    match: 'restContent',
                    type: 'string',
                    default: null
                }
            ],
            description: {
                content: 'Unbans a user from the current server',
                usage: '<user> [reason]',
                examples: ['@Ayush#5234 Mistake',]
            }
        });
    }

    public async exec(message: Message, { user, reason }: { user: User; reason: string | null }) {
        const totalCases = this.client.settings.get<number>(message.guild!, COLLECTION.CASE_TOTAL, 0) + 1;

        const culprit = await message.guild!.members.fetch(user.id).catch(() => null);

        await message.guild!.members.unban(culprit ? culprit.user.id : user.id, reason ?? undefined)

        if (!reason) {
            const prefix = message.guild?.prefix;
            reason = `Use \`${prefix}reason ${totalCases} <...reason>\` to set a reason for this case`;
        }

        const embed = this.client.util.embed()
            .setColor(CASES.COLOR.UNBAN)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(stripIndents`
                **Action:** UNBAN
                **Member:** ${culprit?.user.tag ?? user.tag} (${culprit?.user.id ?? user.id})
                **Reason:** ${reason}
            `)
            .setTimestamp()
            .setFooter(`Case ${totalCases}`);

        const msg = await message.guild?.log({
            embeds: [embed.toJSON()]
        }, 'MOD_LOG');

        await this.client.cases.create({
            guild: message.guild!.id,
            action: CASES.ACTION.UNBAN,
            reason,
            case_id: totalCases,
            closed: false,
            processed: false,
            user_id: culprit ? culprit.user.id : user.id,
            user_tag: culprit ? culprit.user.tag : user.tag,
            author_id: message.author.id,
            author_tag: message.author.tag,
            message: msg?.id ?? '',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        this.client.settings.set(message.guild!, COLLECTION.CASE_TOTAL, totalCases);

        return message.inlineReply(`**${culprit ? culprit.user.tag : user.tag}** was successfully unbanned!`);
    }
}
