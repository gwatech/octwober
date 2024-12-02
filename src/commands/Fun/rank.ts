import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { GuildMember, AttachmentBuilder, User } from 'discord.js';

import { Font, RankCardBuilder as Rank } from 'canvacord';

@ApplyOptions<Command.Options>({
    description: 'Shows you your level and rank in the server.',
    aliases: ['level']
})
export class UserCommand extends Command {
    // Register slash and context menu command
    public override registerApplicationCommands(registry: Command.Registry) {
        // Register slash command
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addUserOption((option) => option.setName('member').setDescription(this.description).setRequired(false))
        );
    }


    public override async chatInputRun(message: Command.ChatInputCommandInteraction) {
        const member = (message.options.getMember('member') ?? message.member) as GuildMember;

        const data = await this.getData(member.user);
        if (!data.userData && !member.user.bot) {
            return message.reply({
                embeds: [
                    {
                        color: 0xff0000,
                        description: `<:Cross:1060646027318800385> **${member.user.tag}** does not have any exp. Start chatting to earn them.`
                    }
                ]
            });
        } else if (member.user.bot) {
            return message.reply({
                embeds: [
                    {
                        color: 0xff0000,
                        description: `<:Cross:1060646027318800385> **${member.user.tag}** is a bot. What is the point of a bot earning exp?`
                    }
                ]
            });
        }

        Font.loadDefault();
        const card = new Rank()
            .setDisplayName(member.user.globalName!) // Big name
            .setUsername(member.user.username) // small name, do not include it if you want to hide it
            .setAvatar(member.displayAvatarURL({ size: 512, forceStatic: true })) // user avatar
            .setCurrentXP(data.currentLevelExp ?? 0) // current xp
            .setRequiredXP(data.levelExp) // required xp
            .setLevel(data.currentLevel) // user level
            .setRank(data.rank) // user rank
            .setOverlay(90) // overlay percentage. Overlay is a semi-transparent layer on top of the background
            .setBackground("#23272a") // set background color or,
            .setStatus(member?.presence?.status ?? 'offline') // user status. Omit this if you want to hide it
            .setTextStyles({ xp: "EXP" })


        const img = await card.build();
        const attachment = new AttachmentBuilder(img, { name: 'rank.png' });

        return message.reply({
            files: [attachment]
        });
    }

    private async getData(user: User) {
        const userData = await this.container.client.db.collection('levels').findOne({ user: user.id });

        const currentLevel = this.container.client.levels.getLevelFromExp(userData?.exp);
        const levelExp = this.container.client.levels.getLevelExp(currentLevel);
        const currentLevelExp = this.container.client.levels.getLevelProgress(userData?.exp);

        const leaderboard = await this.container.client.levels.getLeaderboard()

        const rank = leaderboard.findIndex((item: any) => item.user === user.id) + 1;

        return {
            userData,
            currentLevel,
            levelExp,
            currentLevelExp,
            rank
        };
    }
}