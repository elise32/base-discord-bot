import { ChatInputCommandInteraction, SlashCommandSubcommandBuilder } from 'discord.js';

import Bot from '../../../../Bot.js';
import Subcommand from '../../Subcommand.js';

/**
 * Handler for modal subcommand. Creates a message with a modal to demonstrate this project's modal
 * handling.
 */
class ModalSubcommand extends Subcommand {
    /**
     * @param client The Discord client
     * @param name The name of this subcommand
     */
    constructor(client: Bot, name = 'modal') {
        super(client, name);
    }

    /**
     * @returns The data that describes the command format to the Discord API
     */
    getData() {
        return new SlashCommandSubcommandBuilder()
            .setName(this.name)
            .setDescription('Creates a modal!');
    }

    /**
     * Method to run when this subcommand is executed
     * @param interaction The interaction that was emitted when the slash command was executed
     */
    async run(interaction: ChatInputCommandInteraction) {
        await interaction.showModal(this.client.getModal('myFirstModal'));
    }
}

export default ModalSubcommand;
