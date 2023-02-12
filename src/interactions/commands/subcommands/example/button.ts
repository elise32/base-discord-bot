import {
    ActionRowBuilder,
    ChatInputCommandInteraction,
    MessageActionRowComponentBuilder,
    SlashCommandSubcommandBuilder,
} from 'discord.js';

import Bot from '../../../../Bot.js';
import Subcommand from '../../Subcommand.js';

/**
 * Handler for button subcommand. Creates a message with a button to demonstrate this project's
 * button handling.
 */
class ButtonSubcommand extends Subcommand {
    /**
     * @param client The Discord client
     * @param name The name of this subcommand
     */
    constructor(client: Bot, name = 'button') {
        super(client, name);
    }

    /**
     * @returns {SlashCommandSubcommandBuilder} The data that describes the command format to the
     * Discord API
     */
    getData() {
        return new SlashCommandSubcommandBuilder()
            .setName(this.name)
            .setDescription('Creates a button!');
    }

    /**
     * Method to run when this subcommand is executed
     * @param interaction The interaction that was emitted when the slash command was executed
     */
    async run(interaction: ChatInputCommandInteraction) {
        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
            .addComponents(this.client.getButton('myFirstButton').getData());
        await interaction.reply({ content: 'Ding!', ephemeral: true, components: [row] });
    }
}

export default ButtonSubcommand;
