import { Client as DiscordClient, ClientOptions, Collection, Message } from 'discord.js';
import Database from '../core/Database';
import SettingsProvider from '../core/SettingsProvider';

export type Command = {
    name: string;
    description: string;
    aliases: Array<string>;
    exec: (client: Client, message: Message, args?: Array<any>) => Promise<any>;
    ownerOnly?: boolean;
}

class Client extends DiscordClient {
    mongo: Database; 
    settings: SettingsProvider;
    commands: Collection<string, Command>;
    owner: string;
    prefix: (message: Message) => string;

    constructor(options: ClientOptions | {} = {}) {
        super(options);
        this.commands = new Collection();
    }

    public async setup() {
        this.prefix = (message: Message) => {
            if (message.guild) return this.settings.get(message.guild, 'prefix', '??');
			return '??';
        };
        this.owner = '539770184236269568';

        this.mongo = new Database({
			useNewUrlParser: true,
			useUnifiedTopology: true
        });
        await this.mongo.connect();

        this.settings = new SettingsProvider(this.mongo.db('tsbot').collection('settings'));
        await this.settings.init();

    }

    public async start(token: string) {
        await this.setup();
        return this.login(token)
    }
}

export default Client; 
