import { ButtonBuilder, ButtonInteraction, ButtonStyle } from 'discord.js';

import Bot from '../../../Bot.js';
import Button from '../Button.js';

/**
 * Handler for modalButton button. Example for buttons
 */
class ModalButton extends Button {
    /**
     * @param client The Discord client
     * @param name The name to use to identify this button and to serve as its customId. Must be
     *     unique.
     */
    constructor(client: Bot, name = 'modalButton') {
        super(client, name);
    }

    /**
     * @returns The data that describes the button format to the Discord API.
     */
    getData(): ButtonBuilder {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setLabel('Click for modal!')
            .setStyle(ButtonStyle.Primary);
    }

    /**
     * Method to run when this button is pressed
     * @param interaction The interaction that was emitted when this slash command was executed
     */
    async run(interaction: ButtonInteraction) {
        await interaction.showModal(this.client.getModal('myFirstModal'));
    }
}
export default ModalButton;
