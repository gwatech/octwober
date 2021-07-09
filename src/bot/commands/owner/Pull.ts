import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import shell from 'shelljs'

export default class GitPullCommand extends Command {
    public constructor() {
        super('git-pull', {
            aliases: ['git-pull', 'sync'],
            category: 'owner',
            ownerOnly: true,
            description: {
                content: "You can't use this anyway, so why explain?"
            }
        })
    }

    public exec(message: Message) {
        const { stderr, stdout, code } = shell.exec('git pull')
        return message.util?.send([`${stderr}`, `${stdout}`, `Process exited with code ${code}`], {
            code: true,
            split: true
        })
    }
}
