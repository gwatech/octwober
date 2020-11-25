import { Message } from 'discord.js';
import { readdirSync } from 'fs';
import Client from '../client/client';
import path from 'path';

const commandFiles = readdirSync(path.join(__dirname, '..', 'commands'));

export const command = {
	name: 'reload',
	description: 'Reload',
	aliases: ['r'],
	exec(client: Client, message: Message, args: Array<any>) {
		let str: string;
		if (args.length) {
			if (!client.commands.has(args[0])) return message.channel.send(`The Command \`${args[0]}\` does not exits!`);
			delete require.cache[require.resolve(`../commands/${args[0]}`)];
			const { command: cmd } = require(`../commands/${args[0]}`);
			
			client.commands.set(cmd.name, cmd);
			str = `Reloaded \`${args[0]}\` command`
		} else {
			for (const file of commandFiles) {
				delete require.cache[require.resolve(`../commands/${file}`)];
				const { command } = require(`../commands/${file}`);
				client.commands.set(command.name, command);
			}
			str = `Reloaded \`${client.commands.size}\` commands`
		}
		return message.channel.send(str);
	},
};
