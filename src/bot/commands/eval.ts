import { Message } from 'discord.js';
import { inspect } from 'util';
import Client from '../client/client';

export const command = {
    name: 'eval',
    description: 'eval!',
    ownerOnly: true,
    aliases: ['e'],
    async exec(client: Client, message: Message, args: any[]) {
        const code = args.join(' ');
        if (!code) return;
        const token = client.token?.split('').join('[^]{0,2}');
        const rev = client.token?.split('').reverse().join('[^]{0,2}');
        const filter = new RegExp(`${token}|${rev}`, 'g');

        try {
            let output = eval(code);
            if (output instanceof Promise || (Boolean(output) && typeof output.then === 'function' && typeof output.catch === 'function')) output = await output;

            output = inspect(output, { depth: 0, maxArrayLength: null });
            output = output.replace(filter, 'NO NO NO');
            output = this.clean(output);

            if (output.length < 1950) {
                return message.channel.send(`\`\`\`js\n${output}\n\`\`\``);
            }
            return message.channel.send(`${output}`, {
                split: true,
                code: 'js'
            });
        } catch (error) {
            return message.channel.send(`The following error occured \`\`\`js\n${error}\`\`\``);
        }
    },

    clean(text: string) {
        return text
            .replace(/`/g, `\`${String.fromCharCode(8203)}`)
            .replace(/@/g, `@${String.fromCharCode(8203)}`);
    }
};