import { Listener } from 'discord-akairo';
import { Message, Util } from 'discord.js';
import fetch from 'node-fetch';

export default class AIChatListener extends Listener {
    private readonly cooldowns: Set<string> = new Set();
    public constructor() {
        super('AIChat', {
            event: 'message',
            category: 'client',
            emitter: 'client'
        });
    }

    public async exec(message: Message) {
        if (message.channel.id !== '852110177096564747' || message.author.bot) return;
        if (this.cooldowns.has(message.author.id)) return;

        const data = (await (await fetch(`https://api.monkedev.com/fun/chat?msg=${message.content}&uid=${message.author.id}`)).json());
        
        this.cooldowns.add(message.author.id);
        setTimeout(() => this.cooldowns.delete(message.author.id), 3 * 1000);
        
        if (!data?.response) {
            return message.channel.send('Could not find response');
        }

        return message.inlineReply(Util.cleanContent(data.response, message));
    }
}