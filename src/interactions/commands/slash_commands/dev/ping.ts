import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

import Bot from '../../../../Bot.js';
import SlashCommand from '../../SlashCommand.js';

/**
 * Handler for ping slash command. Replies to the given message with 'pong!'. Can be used to test if
 * the bot is working.
 */
class Ping extends SlashCommand {
    /**
     * @param client The Discord client
     * @param name The name of this slash command
     */
    constructor(client: Bot, name = 'ping') {
        super(client, name);
    }

    /**
     * @returns The data that describes the command format to the Discord API
     */
    getData() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Replies with Pong!');
    }

    /**
     * Method to run when this slash command is executed
     * @param interaction The interaction that was emitted when this slash command was executed
     */
    async run(interaction: ChatInputCommandInteraction) {
        await interaction.reply({ content: 'Pong!', ephemeral: true });
    }
}

export default Ping;
