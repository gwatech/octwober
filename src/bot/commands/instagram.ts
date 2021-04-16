import { Message, MessageEmbed } from 'discord.js';
import Client from '../client/client';
import fetch from 'node-fetch';

export const command = {
    name: 'instagram',
    description: 'Show\'s instagram account info!',
    aliases: ['insta', 'ig'],
    async exec(client: Client, message: Message, args: Array<any>) {

        const account = await (await fetch(`https://instagram40.p.rapidapi.com/account-info?username=${args[0]}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': process.env.IG_API,
                'x-rapidapi-host': 'instagram40.p.rapidapi.com'
            }
        })).json();

        if (account?.status === 'fail') return message.channel.send(account.message);

        const embed = new MessageEmbed()
            .setColor(0xff0651)
            .setTitle(account.full_name)
            .setURL(`https://instagram.com/${account.username}`)
            .setDescription(account?.biography ?? '')
            .setThumbnail(account.profile_pic_url_hd)
            .setAuthor('Profile information')
            .addField('Username:', account.username)
            .addField('Full name:', account.full_name)
            .addField('Posts:', account.edge_owner_to_timeline_media?.count ?? 0)
            .addField('Followers:', account.edge_followed_by?.count ?? 0)
            .addField('Following:', account.edge_follow?.count ?? 0)
            .addField('Account type:', account.is_private ? 'Private 🔐' : 'Public 🔓')
            .setTimestamp();

        return message.channel.send(embed);
    },

};