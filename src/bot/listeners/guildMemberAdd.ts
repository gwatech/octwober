import { GuildMember, Message, TextChannel } from "discord.js";
import Client from "../client/client";
import Functions from '../core/funtions';
import { Listener } from "../core/Types";

const functions = new Functions();

const GuildMemberAddListener: Listener = async (client: Client, member: GuildMember): Promise<Message> => {
    const channel = client.channels.cache.get('768300525456064533') as TextChannel;
    return member.user.bot 
    ? channel.send(`<a:bearkill:765568778905321482>${member.toString()}, Welcome! Oh it's a bot`)
    : channel.send(`<a:Hi:765766930761383976> Welcome ${member.toString()}! Make sure to read the rules in <#694554850708684833> and get your roles from <#730014542209351750>. Happy **${functions.getDay()}!** <a:blobdance:765766933017526283>`);
}

export default GuildMemberAddListener;