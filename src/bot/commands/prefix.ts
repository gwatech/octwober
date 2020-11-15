import { Message, Permissions, Guild } from "discord.js";
import Client from "../client/client";

export const command = {
    name: 'prefix',
    description: 'prefix',
    aliases: [],
    exec(client: Client, message: Message, args: Array<any>) {
        if (!args.length) return message.channel.send(`The prefix for this guild is \`${client.prefix(message)}\``)
        else if (!message.member?.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            return message.channel.send([
                `You are missing \`MANAGE SERVER\` permission to change the prefix.`,
                `The prefix for this guild is \`${client.prefix(message)}\``
            ]);
        } else {
            client.settings.set(message.guild as Guild, 'prefix', args[0]);
            return message.channel.send(`The prefix has been set to \`${args[0]}\``,);
        }
    },
};