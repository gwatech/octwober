import { Listener } from 'discord-akairo';
import { Message } from 'discord.js';
import fetch from 'node-fetch';

export default class aiListener extends Listener {
    public constructor() {
        super('AIChat', {
            event: 'message',
            category: 'client',
            emitter: 'client'
        });
    }

    public async exec(message: Message) {
        if (message.channel.id !== '852110177096564747' || message.author.bot) return;
        const data = (await (
            await fetch(`https://api.monkedev.com/fun/chat?msg=${message.content}&uid=${message.author.id}`)
        ).json());

        if (data.response) {
            return message.inlineReply(data.response);
        }

        return message.channel.send('Could not find response');

    }
}