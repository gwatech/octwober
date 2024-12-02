import type { ClientOptions } from 'discord.js';
import type { Db } from 'mongodb';

import { SapphireClient } from '@sapphire/framework';
import { DatabaseProvider as Database } from './Database';
import { LevelProvider } from './Level';
import { KeyvProvider } from './Keyv';

export class Client extends SapphireClient {
	public override db!: Db;

	constructor(args: ClientOptions) {
		super(args);
	}

	async init() {
		await Database.connect().then(() => this.logger.info('Connected to MongoDB'));
		this.db = Database.db('octwober');

		this.keyv = new KeyvProvider(this.db);
		await this.keyv.init();

		this.levels = new LevelProvider(this.db);

		try {
			this.logger.info('Logging in');
			await this.login();
			this.logger.info('Logged in');
		} catch (error) {
			this.logger.fatal(error);
			this.destroy();
			process.exit(1);
		}
	}
}

declare module 'discord.js' {
	interface Client {
		db: Db;
		keyv: KeyvProvider;
		levels: LevelProvider;
	}
}