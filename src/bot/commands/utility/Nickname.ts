import { Command } from 'discord-akairo';
import { GuildMember, Message } from 'discord.js';

export default class NicknameCommand extends Command {
    public constructor() {
        super('nickname', {
            aliases: ['nickname', 'cn', 'nick'],
            category: 'utility',
            channel: 'guild',
            clientPermissions: ['MANAGE_NICKNAMES', 'CHANGE_NICKNAME', 'MANAGE_MESSAGES'],
            userPermissions: ['MANAGE_NICKNAMES'],
            args: [
                {
                    id: 'member',
                    match: 'phrase',
                    type: 'member',
                    default: (msg: Message) => msg.member
                },
                {
                    id: 'nick',
                    match: 'restContent',
                    type: 'string',
                    prompt: {
                        start: 'What would you like the nickname to be?',
                        retry: 'What would you like the nickname to be?'
                    }
                }
            ],
            description: {
                content: 'Sets a nickname for a member or yourself',
                usage: '<user> <name>',
                examples: ['@Ayush#5234 Admin']
            }
        });
    }

    public async exec(message: Message, { member, nick }: { member: GuildMember; nick: string }) {
        if (message.guild!.ownerID !== message.author.id) {
            if (member.id !== message.author.id) {
                const permissionDiff = message.member!.roles.highest.comparePositionTo(member.roles.highest);
                if (permissionDiff < 0) {
                    return message.inlineReply('You can\'t change nickname of someone with higher role');
                } else if (permissionDiff === 0) {
                    return message.inlineReply('You can\'t change nickname of someone with equal role');
                }
            }
        }
        await member.setNickname(nick);

        return message.inlineReply(`Successfully updated **${member.user.tag}** nickname to \`${member.displayName}\``
        );
    }
}
