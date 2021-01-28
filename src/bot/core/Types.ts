import { Message } from "discord.js";
import Client from "../client/client";


export interface Command {
    name: string;
    description: string;
    aliases: Array<string>;
    exec: (client: Client, message: Message, args?: Array<any>) => Promise<any>;
    ownerOnly?: boolean;
}

export type Listener = (client: Client, ...args: any[]) => any;

