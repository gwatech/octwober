import { Command } from 'discord-akairo';
import { Message, GuildMember } from 'discord.js';
import { COLLECTION, CASES } from '#utils/Constants';
import { stripIndents } from 'common-tags';

export default class KickCommand extends Command {
    public constructor() {
        super('kick', {
            aliases: ['kick-user', 'kick'],
            category: 'Moderation',
            channel: 'guild',
            clientPermissions: ['KICK_MEMBERS', 'MANAGE_MESSAGES'],
            userPermissions: ['KICK_MEMBERS'],
            args: [
                {
                    id: 'culprit',
                    match: 'phrase',
                    type: 'member',
                    prompt: {
                        start: 'Who would you like to kick?',
                        retry: 'An invalid member was entered! Please re-enter a valid member.'
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
                content: 'Kicks a member from the server',
                usage: '<user> [reason]',
                examples: ['@Ayush#5234 self-promotion']
            }
        });
    }

    public async exec(message: Message, { culprit, reason }: { culprit: GuildMember; reason: string | null }) {
        const totalCases = this.client.settings.get<number>(message.guild!, COLLECTION.CASE_TOTAL, 0) + 1;

        const permissionDiff = message.member!.roles.highest.comparePositionTo(culprit.roles.highest);
        if (permissionDiff < 0) {
            return message.inlineReply('You can\'t kick someone with higher role!');
        } else if (permissionDiff === 0) {
            return message.inlineReply('You can\'t kick someone with equal role!');
        }

        if (!culprit.kickable) return message.inlineReply('I can\'t kick this user.');

        await culprit.kick(reason ?? undefined);
        if (!reason) {
            const prefix = message.guild?.prefix;
            reason = `Use \`${prefix}reason ${totalCases} <...reason>\` to set a reason for this case`;
        }

        const embed = this.client.util.embed()
            .setColor(CASES.COLOR.KICK)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(stripIndents`
                **Action:** KICK
                **Member:** ${culprit?.user.tag} (${culprit?.user.id})
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
            user_id: culprit.user.id,
            user_tag: culprit.user.tag,
            author_id: message.author.id,
            author_tag: message.author.tag,
            message: msg?.id ?? '',
            createdAt: new Date(),
            updatedAt: new Date()
        });

        this.client.settings.set(message.guild!, COLLECTION.CASE_TOTAL, totalCases);

        return message.inlineReply(`**${culprit.user.tag}** was successfully banned!`); 
    }
}
