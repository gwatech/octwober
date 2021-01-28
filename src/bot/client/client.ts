import { Client as DiscordClient, ClientOptions, Collection, Message } from 'discord.js';
import Database from '../core/Database';
import SettingsProvider from '../core/SettingsProvider';
import { Command, Listener } from '../core/Types';
import Funtions from '../core/funtions';

const functions = new Funtions();

class Client extends DiscordClient {
    public mongo: Database; 
    public settings: SettingsProvider;
    public commands: Collection<string, Command>;
    public listener: Array<string>;
    public owner: string;
    prefix: (message: Message) => string;

    constructor(options: ClientOptions | {} = {}) {
        super(options);
        this.commands = new Collection();
        this.listener = new Array();
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
        
        functions.loadCommands(this);
        
        this.listener.forEach(file => {
            const event = require(`../listeners/${file}`);
            if (typeof event !== 'function') return;
            const eventName = file.split('.')[0];

            this.on(eventName, event.bind(null, this));
        });

        this.settings = new SettingsProvider(this.mongo.db('tsbot').collection('settings'));
        await this.settings.init();

    }

    public async start(token: string) {
        await this.setup();
        return this.login(token)
    }
}

export default Client; 
