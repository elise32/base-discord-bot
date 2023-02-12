import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

import Bot from '../../../../Bot.js';
import SlashCommand from '../../SlashCommand.js';

/**
 * Handler for echo slash command. Repeats the message back to the user. For the purpose of
 * demonstrating simple parameter handling
 */
class Echo extends SlashCommand {
    /**
     * @param client The Discord client
     * @param name The name of this slash command
     */
    constructor(client: Bot, name = 'echo') {
        super(client, name);
    }

    /**
     * @returns The data that describes the command format to the Discord API
     */
    override getData() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Repeats the input back at you!')
            .addStringOption((option) => option.setName('message')
                .setDescription('The message to echo')
                .setRequired(true));
    }

    /**
     * Method to run when this slash command is executed
     * @param interaction The interaction that was emitted when this slash command was executed
     */
    override async run(interaction: ChatInputCommandInteraction) {
        const message = interaction.options.getString('message', true);
        await interaction.reply({ content: message.replace('\\n', '\n'), ephemeral: true });
    }
}

export default Echo;
