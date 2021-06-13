import { CommandHandler, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import { Message, WebhookMessageOptions } from 'discord.js';
import { UpdateWriteOpResult } from 'mongodb';

import Logger from '#utils/Logger';
import { Connection } from '#struct/Database';
import SettingsProvider from '#struct/SettingsProvider';
import TagHandler from '#struct/TagHandler';
import { SETTINGS } from '#bot/utils/Constants';
import CaseHandler from '#struct/CaseHandler';

declare module 'discord-akairo' {
    interface AkairoClient {
        settings: SettingsProvider;
        db: Db;
        logger: Logger;
        tags: TagHandler;
        commandHandler: CommandHandler;
    }

    interface CommandOptions {
        description?: {
            content?: string;
            usage?: string;
            examples?: string[];
        };
    }
}

declare module 'discord.js' {
    interface Guild {
        setGuildLogChannel(id: string): Promise<UpdateWriteOpResult>;
        setModLogChannel(id: string): Promise<UpdateWriteOpResult>;
        setMemberLogChannel(id: string): Promise<UpdateWriteOpResult>;
        log(message: any, key: keyof typeof SETTINGS, options?: any): Promise<Message | undefined>;
        prefix: string;
    }

    interface Client {
        settings: SettingsProvider;
        db: Db;
        logger: Logger;
        tags: TagHandler;
        commandHandler: CommandHandler;
        cases: CaseHandler
    }

    interface MessageMentionOptions {
        repliedUser?: boolean;
    }

    interface Message {
        inlineReply(content: StringResolvable, options?: MessageOptions): Promise<Message | Message[]>;
        lineReplyNoMention(content: StringResolvable, options?: MessageOptions): Promise<Message | Message[]>;
    }
}