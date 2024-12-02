import type { Events } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { Message } from 'discord.js';

// @ts-expect-error
import { evaluate } from 'mathjs'

export class UserEvent extends Listener<typeof Events.MessageCreate> {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			event: 'messageCreate'
		});
	}

	public async run(message: Message) {
		await this.counting(message);
	}

	private async counting(message: Message) {

		if (message.channel.id !== '1308899977422049293' || message.author.bot) return;

		let { count, num, lastUser } = this.container.client.keyv.get<T>(message.guild!, 'counting', {
			count: 0,
			num: 0,
			lastUser: undefined
		});

		try {
			count = evaluate(message.content);
		} catch (e) {
			return;
		}

		if (isNaN(count)) return;

		if (num === 0 && (count > 1 || count < 1)) {
			num = 0;
			lastUser = undefined;
			this.container.client.keyv.set(message.guild!, 'counting', {
				num,
				count,
				lastUser
			});
			message.react('❌');
			return send(message, 'Incorrect number! The next number is `1`. **No stats have been changed since the current number was 0.**');
		} else if (count === num + 1) {
			if (lastUser && lastUser === message.author.id) {
				message.react('❌');
				const Lastnum = num;
				lastUser = undefined;
				num = 0;

				this.container.client.keyv.set(message.guild!, 'counting', {
					num,
					count,
					lastUser
				});

				return send(message,
					`${message.author.toString()} RUINED IT AT \`${Lastnum}\` Next number is \`1\`. **You can't count two numbers in a row.**`
				);
			}
			lastUser = message.author.id;
			num++;
			this.container.client.keyv.set(message.guild!, 'counting', {
				num,
				count,
				lastUser
			});
			return message.react('✅');
		} else {
			message.react('❌');
			const Lastnum: number = num;
			lastUser = undefined;
			num = 0;
			this.container.client.keyv.set(message.guild!, 'counting', {
				num,
				count,
				lastUser
			});
			return send(message, `${message.author} RUINED IT AT \`${Lastnum}\` Next number is \`1\`. **Wrong number.**`);
		}
	}
}

interface T {
	count: number;
	num: number;
	lastUser: string | undefined;
}