import { Command, Flag, Argument } from 'discord-akairo';
import { Message } from 'discord.js';
import { codeBlock, isThenable } from '@sapphire/utilities';
import { Type } from '@sapphire/type';
import fetch from 'node-fetch';
import util from 'util';

export default class EvalCommand extends Command {
    public constructor() {
        super('eval', {
            aliases: ['eval', 'e'],
            category: 'owner',
            ownerOnly: true,
            description: {},
            optionFlags: ['--depth', '-d']
        });
    }

    public *args(): unknown {
        const depth = yield {
            match: 'option',
            type: Argument.range('integer', 0, 3, true),
            flag: ['--depth', '-d'],
            default: 0
        };

        const code = yield {
            match: 'rest',
            type: (msg: Message, code: string) => {
                if (!code) return Flag.cancel();
                return code;
            }
        };

        return { code, depth };
    }

    public async exec(message: Message, { code, depth }: { code: string; depth: number }) {
        let { result, success, type } = await this.eval(message, code, depth);

        const token = this.client.token!.split('').join('[^]{0,2}');
        const rev = this.client.token!.split('').reverse().join('[^]{0,2}');
        const filter = new RegExp(`${token}|${rev}`, 'g');

        result = result.replace(filter, '[TOKEN ENCRYPTED]');
        result = this.clean(result);
        const output = success ? codeBlock('js', result) : `**ERROR**: ${codeBlock('bash', result)}`;

        const typeFooter = `**Type**: ${codeBlock('typescript', type)}`;

        if (output.length > 2000) {
            try {
                const haste = await this.getHaste(result);
                return message.util?.send(`${haste}\n\n${typeFooter}`);
            } catch (e) {
                console.log(e);
                return message.util?.send(`Output was too long. Sent the result as a file.`, {
                    files: [{ attachment: Buffer.from(output), name: 'output.txt' }]
                });
            }
        }

        return message.util?.send(`${output}\n${typeFooter}`);
    }

    private async eval(message: Message, code: string, depth: number) {
        let success = true;
        let result = null;
        try {
            // eslint-disable-next-line no-eval
            result = eval(code);
        } catch (error) {
            if (error && error.stack) {
                this.client.logger.error(error, { label: 'ERROR' });
            }
            result = error;
            success = false;
        }

        const type = new Type(result).toString();
        if (isThenable(result)) result = await result;

        if (typeof result !== 'string') {
            result = util.inspect(result, {
                depth: depth
            });
        }

        return { result, success, type };
    }

    private async getHaste(result: string) {
        const res = await fetch('https://hastebin.skyra.pw/documents', {
            method: 'POST',
            body: result,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const { key } = await res?.json();
        return `https://hastebin.skyra.pw/${key}.js`;
    }

    private clean(text: string) {
        return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
    }
}
