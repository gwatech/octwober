import { Message, MessageAttachment } from 'discord.js';
import Client, { Command } from '../client/client';
import fetch from 'node-fetch';

interface ImageAPI {
    message: string;
}

export const command: Command = {
	name: 'cmm',
	description: 'Change my mind!',
	aliases: ['changemymind'],
	async exec(client: Client, message: Message, args: Array<any>) {
        if (!args.length) return message.channel.send('Please provide a text to display');
        const text = args.join(' ');


		const res = await fetch(encodeURI(`https://nekobot.xyz/api/imagegen?type=changemymind&text=${text}`));
        const data: ImageAPI = await res.json();

        const attachment = new MessageAttachment(data.message, 'changemymind.png');

        return message.channel.send(attachment);
	},
};