import { Command } from 'discord-akairo';
import { Message, GuildMember } from 'discord.js';
import ms from 'ms';
import { stripIndents } from 'common-tags';

import { COLLECTION, CASES } from '#utils/Constants';

export default class MuteCommand extends Command {
    public constructor() {
        super('mute', {
            aliases: ['mute-user', 'mute'],
            category: 'mod',
            channel: 'guild',
            clientPermissions: ['MANAGE_ROLES', 'MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_ROLES'],
            args: [
                {
                    id: 'culprit',
                    match: 'phrase',
                    type: 'member',
                    prompt: {
                        start: 'Who would you like to mute?',
                        retry: 'An invalid member was entered! Please re-enter a valid member.'
                    }
                },
                {
                    id: 'time',
                    match: 'phrase',
                    type: (_message, name) => {
                        if (name.length === 0) return null;
                        const length = ms(name);
                        if (isNaN(length) || length < 1) return null;
                        return Math.min(length, 15 * 24 * 60 * 60 * 1000);
                    },
                    prompt: {
                        start: 'How long would you like the mute to last?',
                        retry: 'An invalid time duration was entered! Please re-enter a valid duration.'
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
                content: 'Mutes a user in the current server',
                usage: '<user> <time>',
                examples: ['@Ayush#4234 30m']
            }
        });
    }

    public async exec(message: Message, { culprit, time, reason }: { culprit: GuildMember; time: number; reason: string | null }) {
        const totalCases = this.client.settings.get<number>(message.guild!, COLLECTION.CASE_TOTAL, 0) + 1;

        const permissionDiff = message.member!.roles.highest.comparePositionTo(culprit.roles.highest);
        if (permissionDiff < 0) {
            return message.inlineReply('You can\'t mute someone with higher role!');
        } else if (permissionDiff === 0) {
            return message.inlineReply('You can\'t mute someone with equal role!');
        }

        if (!reason) {
            const prefix = message.guild?.prefix;
            reason = `Use \`${prefix}reason ${totalCases} <...reason>\` to set a reason for this case`;
        }

        const embed = this.client.util.embed()
            .setColor(CASES.COLOR.MUTE)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(stripIndents`
                **Action:** MUTE
                **Member:** ${culprit.user.tag} (${culprit.id})
                **Length:** ${ms(time, { long: true })}
                **Reason:** ${reason}
            `)
            .setTimestamp()
            .setFooter(`Case ${totalCases}`);

        const msg = await message.guild?.log({
            embeds: [embed.toJSON()]
        }, 'MOD_LOG');

        await this.client.cases.mutes.add({
            guild: message.guild!.id,
			action: CASES.ACTION.MUTE,
			duration: new Date(Date.now() + time),
			reason,
			case_id: totalCases,
            processed: false,
			closed: false,
			user_id: culprit.id,
			user_tag: culprit.user?.tag,
			author_id: message.author.id,
			author_tag: message.author.tag,
			message: msg?.id ?? '',
			createdAt: new Date(),
			updatedAt: new Date()
        }, culprit, message);

        this.client.settings.set(message.guild!, COLLECTION.CASE_TOTAL, totalCases);

        return message.inlineReply(`**${culprit.displayName}** successfully muted for \`${ms(time, { long: true })}\``);
    }
}
