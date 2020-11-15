import Client from './bot/client/client';
import { GuildMember, Message, MessageReaction, TextChannel } from 'discord.js';
import { config } from './bot/core/config';
import Functions from './bot/core/funtions';

const client = new Client();
const functions = new Functions();

client.on('ready', () => {
    functions.loadCommands(client);
    return console.log(`READY [${client.user?.tag}]`);
});

client.on('message', async (message: Message): Promise<Message | MessageReaction> => {
    if (message.channel.type === 'dm' || message.author.bot) return;

    const data = await functions.parseCommand(message);
    if (data?.command) return data.command.exec(client, message, data.content);
    
    if (message.channel.id !== '776312696390811658') return;
    functions.counting(message);
});


client.on('guildMemberAdd', (member: GuildMember): Promise<Message> => {
    const channel = client.channels.cache.get('768300525456064533') as TextChannel;
    return member.user.bot 
    ? channel.send(`<a:bearkill:765568778905321482>${member.toString()}, Welcome! Oh it's a bot`)
    : channel.send(`<a:Hi:765766930761383976> Welcome ${member.toString()}! Make sure to read the rules in <#694554850708684833> and get your roles from <#730014542209351750>. Happy **${functions.getDay()}!** <a:blobdance:765766933017526283>`);
});

client.on('guildMemberRemove', (member: GuildMember): Promise<Message> => {
    const channel = client.channels.cache.get('768300525456064533') as TextChannel;
    return member.user.bot
    ? channel.send(`<a:crii:765561558335225887> **${member.user.username}** left the server! Oh it's a bot`)
    : channel.send(`<a:crii:765561558335225887> **${member.user.username}** left the server! ${functions.randomMessage()}`);
});

client.start(config.token);