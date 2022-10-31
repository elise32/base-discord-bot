import { ButtonBuilder, ButtonStyle } from 'discord.js';
import Button from '../Button.js';

/**
 * Handler for modalButton button. Example for buttons
 */
class ModalButton extends Button {
    /**
     * @param {string} name The name to use to identify this button and to serve as its customId. Must be unique.
     */
    constructor(name = 'modalButton') {
        super(name);
    }

    /**
     * @returns {ButtonBuilder} The data that describes the button format to the Discord API.
     */
    getData() {
        return new ButtonBuilder()
            .setCustomId(this.name)
            .setLabel('Click for modal!')
            .setStyle(ButtonStyle.Primary);
    }

    /**
     * Method to run when this button is pressed
     * @param {ButtonInteraction} interaction The interaction that was emitted when this slash command was executed
     */
    async run(interaction) {
        const modalInteraction = await interaction.client.getModal('myFirstModal').show(interaction, true);
        const favoriteColor = modalInteraction.fields.getTextInputValue('favoriteColorInput');
        const hobbies = modalInteraction.fields.getTextInputValue('hobbiesInput');
        await modalInteraction.update({ content: `${favoriteColor}\n${hobbies}` });
    }
}
export default ModalButton;
