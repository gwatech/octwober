import Client from '../client/client';
import { Message, MessageEmbed } from 'discord.js';
export const command = {
    name: 'help',
    description: 'Help Command!',
    aliases: [],
    exec(client: Client, message: Message, args: Array<any>) {
        const embed = new MessageEmbed()
            .setColor(11642864)
            .setTitle('Commands');

        let str: string = '';

        for (const cmd of client.commands.values()) {
            str += `${cmd.aliases.concat(cmd.name).map((cmd: string) => `\`${cmd}\``).join(' / ')}\n**${cmd.description}**\n\n`;
        }
        embed.setDescription(str);

        return message.channel.send({ embed });
    },
    
};