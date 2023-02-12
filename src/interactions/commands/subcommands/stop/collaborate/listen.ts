import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js';

import Bot from '../../../../../Bot.js';
import SubCommand from '../../../Subcommand.js';

/**
 * Handler for Listen subcommand. Demonstration of a subcommand within a subcommand group.
 */
class Listen extends SubCommand {
    /**
     * @param client The Discord client
     * @param name The name of this subcommand
     */
    constructor(client: Bot, name = 'listen') {
        super(client, name);
    }

    /**
     * @returns The data that describes the command format to the Discord API
     */
    getData() {
        return new SlashCommandSubcommandBuilder()
            .setName(this.name)
            .setDescription('From the famous song, \'Water Vapor, Water Vapor, Adult\'');
    }

    /**
     * Method to run when this subcommand is executed
     * @param interaction The interaction that was emitted when the slash command was executed
     */
    async run(interaction: ChatInputCommandInteraction) {
        await interaction.reply({ content: 'Stop, collaborate and listen!', ephemeral: true });
    }
}

export default Listen;
