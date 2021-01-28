import Client from "../client/client";
import { Listener } from "../core/Types";
import Functions from '../core/funtions';
import { Message, MessageReaction } from "discord.js";

const functions = new Functions();

const MessageUpdateListener: Listener = async (client: Client, _: Message, message: Message):Promise<Message | MessageReaction> => {
    if (message.partial) return;
    if (message.channel.type === 'dm' || message.author.bot) return;

    const data = await functions.parseCommand(message);
    if (data?.command) return data.command.exec(client, message, data.content);
}

export default MessageUpdateListener;