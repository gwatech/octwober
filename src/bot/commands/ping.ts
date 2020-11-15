import { Message } from 'discord.js';
import Client from '../client/client';

export const command = {
	name: 'ping',
	description: 'Ping!',
	aliases: [],
	async exec(client: Client, message: Message, args: Array<any>) {
		const msg = await message.channel.send('Pinging...');

		const sentTime = msg.editedTimestamp || msg.createdTimestamp;
		const startTime = message.editedTimestamp || message.createdTimestamp;

		return msg.edit(`
Gateway Latency: \`${sentTime - startTime}ms\`		
API Latency: \`${client.ws.ping}ms\`		
		`);
	},
};