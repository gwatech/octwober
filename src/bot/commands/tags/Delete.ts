import { Command, Flag } from 'discord-akairo';
import { Message } from 'discord.js';

export default class TagDeleteCommand extends Command {
	public constructor() {
		super('tag-delete', {
			category: 'tag',
			channel: 'guild',
			description: {},
		});
	}

	public *args(msg: Message): unknown {
		const name = yield {
			match: 'content',
            type: async (msg: Message, name: string) => {
                if (!name) return null;
                const tag = await this.client.tags.find(name, msg.guild!.id);
                if (!tag) return Flag.fail(name);
                return tag.name.toLowerCase();
            },
            prompt: {
                start: 'What should be the name of tag?',
                retry: (msg: Message, { failure }: { failure: { value: string } }) => `Tag with the name **${failure.value}** does not exists. Re-enter a valid name.`
            }	
        };

		return { name };
	}

	public async exec(message: Message, { name }: { name?: string }) {
		const del = await this.client.tags.collection.deleteOne({ guild: message.guild!.id, name });
		if (!del.deletedCount) return message.util!.send('**No matches found!**');
		
        return message.util?.send({
            embed: { description: `Tag with the name **${name}** has been deleted.`, color: 11642864 }
        });
	}
}