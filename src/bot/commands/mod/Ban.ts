import { Argument } from 'discord-akairo';
import { Command } from 'discord-akairo';
import { Message, User } from 'discord.js';
import { stripIndents } from 'common-tags';

import { COLOR, COLLECTION, CASES } from '#utils/Constants';

export default class BanCommand extends Command {
    public constructor() {
        super('ban', {
            aliases: ['ban'],
            category: 'mod',
            channel: 'guild',
            clientPermissions: ['BAN_MEMBERS', 'MANAGE_MESSAGES'],
            userPermissions: ['BAN_MEMBERS'],
            args: [
                {
                    id: 'user',
                    type: Argument.union('user', (_, id) => id ? this.client.users.fetch(id).catch(() => null) : null),
                    prompt: {
                        start: 'Whom would you like to ban?',
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
                content: 'Bans a user from the current server',
                usage: '<user> [reason]',
                examples: ['Ayush NSFW', '539770184236269568 Alt', '@Ayush']
            }
        });
    }

    public async exec(message: Message, { user, reason }: { user: User; reason: string | null }) {
        const totalCases = this.client.settings.get<number>(message.guild!, COLLECTION.CASE_TOTAL, 0) + 1;

        const culprit = await message.guild!.members.fetch(user.id).catch(() => null);

        if (culprit) {
            if (message.author.id !== message.guild!.ownerID) {
                const permissionDiff = message.member!.roles.highest.comparePositionTo(culprit.roles.highest);
                if (permissionDiff < 0) {
                    return message.inlineReply('You can\'t ban someone with higher role!');
                } else if (permissionDiff === 0) {
                    return message.inlineReply('You can\'t ban someone with equal role!');
                }
            }

            if (!culprit.bannable) return message.inlineReply('I can\'t ban this user.');
        }

        await message.guild!.members.ban(culprit ? culprit.user.id : user.id, { reason: reason ?? undefined })

        if (!reason) {
            const prefix = message.guild?.prefix;
            reason = `Use \`${prefix}reason ${totalCases} <...reason>\` to set a reason for this case`;
        }

        const embed = this.client.util.embed()
            .setColor(CASES.COLOR.BAN)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(stripIndents`
                **Action:** BAN
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
            action: CASES.ACTION.BAN,
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
        })

        this.client.settings.set(message.guild!, COLLECTION.CASE_TOTAL, totalCases);

        return message.inlineReply(`**${culprit ? culprit.user.tag : user.tag}** was successfully banned!`);
    }
}
