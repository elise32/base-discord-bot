import {
    ActionRowBuilder,
    InteractionUpdateOptions,
    Message,
    MessagePayload,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    ModalSubmitInteraction,
    TextInputBuilder,
    TextInputStyle,
} from 'discord.js';

import Bot from '../../Bot.js';
import Modal from '../Modal.js';

interface Updatable {
    update: (options: string | MessagePayload | InteractionUpdateOptions) => Promise<Message | void>
}

function canUpdate(interaction: ModalSubmitInteraction)
    : interaction is ModalSubmitInteraction & Updatable {
    return 'update' in interaction;
}

/**
 * Handler for myFirstModal modal. Demonstration of modal handling.
 */
class MyFirstModal extends Modal {
    /**
     * @param client The Discord client
     * @param name The name of this modal
     */
    constructor(client: Bot, name = 'myFirstModal') {
        super(client, name);
    }

    /**
     * @returns {ModalBuilder} The data that describes the modal format to the Discord API
     */
    getData() {
        // Courtesy of https://discordjs.guide/interactions/modals.html
        return new ModalBuilder()
            .setCustomId(this.name)
            .setTitle('My Modal')
            .addComponents(
                new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('favoriteColorInput')
                            .setLabel("What's your favorite color?")
                            .setStyle(TextInputStyle.Short)
                            .setMaxLength(1000)
                            .setMinLength(5)
                            .setPlaceholder('Enter some text!')
                            .setValue('Default')
                            .setRequired(true),
                    ),
                new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('hobbiesInput')
                            .setLabel("What's some of your favorite hobbies?")
                            .setStyle(TextInputStyle.Paragraph),
                    ),
            );
    }

    /**
     * Method to run when this modal is submitted
     * @param 1interaction The interaction that was emitted when this modal was submitted
     */
    async run(interaction: ModalSubmitInteraction) {
        const favoriteColor = interaction.fields.getTextInputValue('favoriteColorInput');
        const hobbies = interaction.fields.getTextInputValue('hobbiesInput');

        /*
         * A bit of interpretive jiggery-pokery: if the modal was shown from a ButtonInteraction or
         * SelectMenuInteraction, the interaction will provide update() and deferUpdate(). We can
         * determine this by checking if message exists.
         */
        if (canUpdate(interaction)) {
            await interaction.update({ content: `${favoriteColor}\n${hobbies}` });
        } else {
            await interaction.reply({ content: `${favoriteColor}\n${hobbies}`, ephemeral: true });
        }
    }
}

export default MyFirstModal;
