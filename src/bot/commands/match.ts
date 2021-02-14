import { Message, MessageEmbed, Snowflake, User } from 'discord.js';
import Client from '../client/client';

export const command = {
    name: 'match',
    description: 'Matches your partener!',
    aliases: [],
    async exec(client: Client, message: Message, args: Array<any>) {
        const user = this.resolveUser(args);
        const partner = message.guild.members.cache.random().user;

        const love = Math.random() * 100;

        const loveIndex = Math.floor(love / 10);
        const loveLevel = '💖'.repeat(loveIndex) + '💔'.repeat(10 - loveIndex);

        const msg = await message.channel.send('<a:google_assistant:765561564698771456> Finding Your Partner');

        const embed = new MessageEmbed() 
        .setColor('#ffb6c1')
        .setDescription([
            `${user} your partner is ${partner}`,
            '',
            '**Match Percentage**',
            `💟 ${Math.floor(love)}`,
            '',
            `${loveLevel}`
        ]);

        client.setTimeout(() => {
            return msg.edit(embed);
        }, 1000 * 15);
    },

    resolveUser(user: Snowflake | string | undefined, message: Message): User {
        const userRegex = /^(?:<@!?)?(\d{17,19})>?$/;

        const match = userRegex.exec(user);

        return match ? message.client.users.cache.get(match[1]) : message.author;
    }
};