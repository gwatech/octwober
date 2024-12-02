import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';

@ApplyOptions<Command.Options>({
    description: 'Shows the last number while counting!'
})
export class UserCommand extends Command {
    // Register slash and context menu command
    public override registerApplicationCommands(registry: Command.Registry) {
        // Register slash command
        registry.registerChatInputCommand({
            name: this.name,
            description: this.description
        });
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        if (interaction.channel!.id !== '1308899977422049293') return;

        const { num, lastUser } = this.container.client.keyv.get<{ num: number; lastUser: string }>(interaction.guild?.id!, 'counting', {
            num: 0,
            lastUser: undefined
        });

        const user = await this.container.client.users.fetch(lastUser).catch(() => null);

        return interaction.reply({
            embeds: [{
                description: `The last number was \`${num}\`${user ? ` entered by **${user}**` : ''} `
            }]
        });
    }
}