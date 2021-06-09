import { Message, MessageEmbed, User } from 'discord.js';
import { Command } from 'discord-akairo';
import { COLOR } from '#utils/Constants';

export default class TagListCommand extends Command {
	public constructor() {
		super('tag-list', {
			aliases: ['tags'],
			category: 'tag',
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS']		
        });
	}

	public *args(msg: Message): unknown {
		const user = yield {
			type: 'user',
			match: 'phrase',
			default: (message: Message) => message.author
		};

		return { user };
	}

	public async exec(message: Message, { user }: { user?: User }) {
		const allTags = await this.client.tags.collection.find({ guild: message.guild!.id }).toArray();

		const embed = new MessageEmbed()
			.setAuthor(message.guild!.name, message.guild!.iconURL()!)
			.setColor(COLOR)
			.setDescription(allTags?.length ? [
				'**Pinned Tags**',
				allTags.filter(tag => tag.hoisted)
					.map(tag => `\`${tag.name}\``)
					.sort()
					.join(', ')
			] : '');

		const userTags = allTags.filter(tag => !tag.hoisted && tag.user === user?.id);
		if (userTags.length && user) {
			embed.addField(
				'\u200b',
				[
					`**${user.username}\'s Tags**`,
					userTags.map(tag => `\`${tag.name}\``)
						.sort()
						.join(', ')
				]
			);
		}

		return message.util!.send({ embed });
	}
}