import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    SlashCommandSubcommandBuilder,
} from 'discord.js';

import Bot from '../../../../Bot.js';
import SelectMenu from '../../../message_components/SelectMenu.js';
import Subcommand from '../../Subcommand.js';

/**
 * Handler for SelectMenu subcommand. Creates a message with a select menu to demonstrate this
 * project's select menu handling.
 */
class SelectMenuSubcommand extends Subcommand {
    /**
     * @param client The Discord client
     * @param name The name of this subcommand
     */
    constructor(client: Bot, name = 'selectmenu') {
        super(client, name);
    }

    /**
     * @returns The data that describes the command format to the Discord API
     */
    getData() {
        return new SlashCommandSubcommandBuilder()
            .setName(this.name)
            .setDescription('Creates a select menu!');
    }

    /**
     * Method to run when this subcommand is executed
     * @param interaction The interaction that was emitted when the slash command was executed
     */
    async run(interaction: ChatInputCommandInteraction) {
        const row = new ActionRowBuilder()<SelectMenu>()
            .addComponents(interaction.client.getSelectMenu('myFirstSelectMenu'));
        await interaction.reply({ content: 'Select!', ephemeral: true, components: [row] });
    }
}

export default SelectMenuSubcommand;
