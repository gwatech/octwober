import { GuildMember, Message, TextChannel } from "discord.js";
import Client from "../client/client";
import Functions from '../core/funtions';
import { Listener } from "../core/Types";

const functions = new Functions();

const GuildMemberRemoveListener: Listener = async (client: Client, member: GuildMember): Promise<Message> => {
    const channel = client.channels.cache.get('768300525456064533') as TextChannel;
    return member.user.bot
    ? channel.send(`<a:crii:765561558335225887> **${member.user.username}** left the server! Oh it's a bot`)
    : channel.send(`<a:crii:765561558335225887> **${member.user.username}** left the server! ${functions.randomMessage()}`);
}

export default GuildMemberRemoveListener;