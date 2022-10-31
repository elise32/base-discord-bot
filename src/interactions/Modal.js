import crypto from 'crypto';
import { CommandInteraction, MessageComponentInteraction, ModalBuilder } from 'discord.js';
import Interaction from './Interaction.js';

/**
 * Parent class for modal interaction handlers.
 */
class Modal extends Interaction {
    /**
     * Shows a modal and collects the interaction created when said modal is submitted
     * @param {(CommandInteraction|MessageComponentInteraction)} interaction The interaction to show a modal from
     * @param {(Modal|ModalBuilder)} modal A representation of a modal that is either a Modal or ModalBuilder
     * @param {boolean} [anonymize=false] Whether or not to change the custom id of the modal such that it will not
     *     match the name of any existing handlers in the client (i.e. this prevents the handler from running)
     * @return {Promise<ModalSubmitInteraction>} The interaction created when the passed modal is submitted
     */
    static async show(interaction, modal, anonymize = false) {
        // type guard
        if (!(interaction instanceof CommandInteraction) && !(interaction instanceof MessageComponentInteraction)) {
            throw new TypeError(`Argument 'interaction' was of type ${interaction.constructor.name} when type CommandInteraction or MessageComponentInteraction was expected!`);
        }

        // anonymize the custom id if necessary and assign the final custom id
        let data = modal;
        if (modal instanceof Modal || modal instanceof ModalBuilder) { // coerce the modal into json
            data = modal.toJSON();
        }

        let customId = data.custom_id;
        if (anonymize) {
            // create a custom id and ensure that it does not collide with any existing stored modal id
            do {
                customId = crypto.randomUUID();
            } while (interaction.client.getModal(customId));
        }

        data.custom_id = customId;

        // show modal
        await interaction.showModal(data);

        // await response
        const filter = (i) => i.customId === customId;
        return interaction.awaitModalSubmit({ filter, time: 7 * 24 * 60 * 60 * 1000 }); // one week of waiting should suffice
    }

    /**
     * Shows a modal and collects the interaction created when said modal is submitted
     * @param {(CommandInteraction|MessageComponentInteraction)} interaction The interaction to show a modal from
     * @param {(Modal|ModalBuilder)} modal A representation of a modal that is either a Modal or ModalBuilder
     * @param {boolean} [anonymize=false] Whether or not to change the custom id of the modal such that it will not
     *     match the name of any existing handlers in the client (i.e. this prevents the handler from running)
     * @return {Promise<ModalSubmitInteraction>} The interaction created when the passed modal is submitted
     */
    async show(interaction, anonymize = false) {
        return this.constructor.show(interaction, this, anonymize);
    }
}

export default Modal;
