import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder,
} from 'discord.js';

import Bot from '../../../../Bot';
import Subcommand from '../../Subcommand.js';

/**
 * Handler for modalviabutton subcommand. Creates a message with a button that shows a modal to
 * demonstrate the behavior of modals when they come from a message component.
 */
class ModalViaButton extends Subcommand {
    /**
     * @param client The Discord client
     * @param name The name of this subcommand
     */
    constructor(client: Bot, name = 'modalviabutton') {
        super(client, name);
    }

    /**
     * @returns The data that describes the command format to the Discord API
     */
    getData() {
        return new SlashCommandSubcommandBuilder()
            .setName(this.name)
            .setDescription('Creates a modal triggered by a button!');
    }

    /**
     * Method to run when this subcommand is executed
     * @param interaction The interaction that was emitted when the slash command was executed
     */
    async run(interaction: ChatInputCommandInteraction) {
        const row = new ActionRowBuilder()
            .addComponents(interaction.client.getButton('modalButton'));
        await interaction.reply({ ephemeral: true, components: [row] });
    }
}

export default ModalViaButton;
