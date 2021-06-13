import { AkairoClient, ListenerHandler, InhibitorHandler, CommandHandler } from 'discord-akairo';
import { Intents, MessageEmbed } from 'discord.js';
import { Db } from 'mongodb';
import path from 'path';

import Logger from '#utils/Logger';
import { Connection } from '#struct/Database';
import SettingsProvider from '#struct/SettingsProvider';
import TagHandler from '#struct/TagHandler';
import CaseHandler from '#struct/CaseHandler';

export default class Client extends AkairoClient {
    public settings!: SettingsProvider;
    public db!: Db;
    public logger: Logger = new Logger();
    public tags!: TagHandler;
    public cases!: CaseHandler;

    public commandHandler: CommandHandler = new CommandHandler(this, {
        directory: path.join(__dirname, '..', 'commands'),
        prefix: (msg) => this.settings.get(msg.guild!, 'prefix', '??'),
        aliasReplacement: /-/g,
        allowMention: true,
        fetchMembers: true,
        commandUtil: true,
        handleEdits: true,
        defaultCooldown: 3000,
        commandUtilLifetime: 3e5,
        commandUtilSweepInterval: 9e5,
        blockBots: true,
        blockClient: true
    });

    public listenerHandler: ListenerHandler = new ListenerHandler(this, {
        directory: path.join(__dirname, '..', 'listeners')
    });

    public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
        directory: path.join(__dirname, '..', 'inhibitors')
    });

    public constructor() {
        super({ ownerID: ['539770184236269568', '819942484443529318'] }, {
            messageCacheMaxSize: 50,
            messageCacheLifetime: 150,
            messageSweepInterval: 150,
            messageEditHistoryMaxSize: 5,
            ws: { intents: Intents.ALL }
        }
        );
    }

    private async init() {
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.commandHandler.useListenerHandler(this.listenerHandler);
        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            listenerHandler: this.listenerHandler,
            inhibitorHandler: this.inhibitorHandler
        });

        this.commandHandler.loadAll();
        this.listenerHandler.loadAll();
        this.inhibitorHandler.loadAll();

        await Connection.connect().then(() =>
            this.logger.info('Database Connected', {
                label: 'DB'
            })
        );
        this.db = Connection.db('octwober');

        this.settings = new SettingsProvider(this.db);
        await this.settings.init();

        this.tags = new TagHandler(this);
        this.cases = new CaseHandler(this);

        this.once('ready', async () => await this.cases.mutes.init());
    }

    public async start(token: string) {
        await this.init();
        return this.login(token);
    }
}