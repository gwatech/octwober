import { Message } from 'discord.js';
import Client from '../client/client';

export const command = {
    name: 'lastnum',
    description: 'Shows the last number while counting!',
    aliases: ['lastnum', 'last', 'ln'],
    async exec(client: Client, message: Message, args: Array<any>) {
        if (message.channel.id !== '777473504060768316') return;

        const { num, lastUser } = client.settings.get(message.guild.id, 'counting', {
            num: 0,
            lastUser: undefined
        });

        const user = await client.users.fetch(lastUser).catch(() => null);

        return message.channel.send({
            embed: {
                description: `The last number was \`${num}\`${user ? ` entered by **${user}**` : ''} `
            }
        });
    },
};