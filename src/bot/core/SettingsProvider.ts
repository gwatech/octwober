import { Collection, Guild } from 'discord.js';
export default class MongoDBProvider{
    database: any;
    items: Collection<string, any>;
	constructor(database: any) {
        this.database = database;
        this.items = new Collection();
	}

	public async init(): Promise<undefined> {
		return this.database.find().toArray()
			.then((data: any[])=> {
				data.forEach(data => {
					this.items.set(data.id, data);
				});
			});
	}

	public get(guild: string | Guild , key: string, defaultValue?: any): any {
        const id = this.getGuildId(guild);
		if (this.items.has(id)) {
			const value = this.items.get(id)[key];
			return value == null ? defaultValue : value;
		}

		return defaultValue;
	}


	public set(guild: string | Guild, key: string, value: any): any {
        const id = this.getGuildId(guild);
		const data = this.items.get(id) || {};
		data[key] = value;
		this.items.set(id, data);

		return this.database.updateOne(
			{ id },
			{ $set: { [key]: value } },
			{ upsert: true }
		);
	}

	public delete(guild: string | Guild, key: string): any {
        const id = this.getGuildId(guild);
		const data = this.items.get(id) || {};
		delete data[key];

		return this.database.updateOne({ id }, {
			$unset: { [key]: '' }
		}, { upsert: true });
	}

	public clear(guild: string | Guild): any {
        const id = this.getGuildId(guild);
		this.items.delete(id);
		return this.database.deleteOne({ id });
    }
    
    protected getGuildId(guild: string | Guild): string {
        if (guild instanceof Guild) return guild.id;
        if (guild === 'global' || guild === null) return '0';
        if (typeof guild === 'string' && /^\d+$/.test(guild)) return guild;
        throw new TypeError('Invalid guild specified. Must be a Guild instance, guild ID, "global", or null.');
    }
}
