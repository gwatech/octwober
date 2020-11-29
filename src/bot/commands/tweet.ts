import { Message, MessageAttachment } from 'discord.js';
import Client, { Command } from '../client/client';
import fetch from 'node-fetch';

interface ImageAPI {
    message: string;
}

export const command: Command = {
    name: 'tweet',
    description: 'Fakes A Tweet',
    aliases: [],
    async exec(client: Client, message: Message, args: Array<any>) {
        const user = args[0];
        const text = args.slice(1).join('');

        const msg = await message.channel.send('**Generating the image**');

        if (!user) {
            return msg.edit('**You Have To Enter Someone\'s Twitter Username!**');
        } else if (!text) {
            return msg.edit('**You must enter a tweet!**');
        }

        const res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=tweet&username=${user}&text=${text}`));
        const data: ImageAPI = await res.json();
        const attachment = new MessageAttachment(data.message, 'tweet.png');
        await message.channel.send(attachment);
        return msg.delete();
    },
};