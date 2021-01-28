import Client from "../client/client";
import { Listener } from "../core/Types";
import Functions from '../core/funtions';
import { Message, MessageReaction } from "discord.js";

const functions = new Functions();

const MessageListener: Listener = async (client: Client, message: Message):Promise<Message | MessageReaction> => {
    if (message.channel.type === 'dm' || message.author.bot) return;

    const data = await functions.parseCommand(message);
    if (data?.command) return data.command.exec(client, message, data.content);
    
    if (message.channel.id !== '777473504060768316') return;
    functions.counting(message);
}

export default MessageListener;