import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from 'discord.js';

import Bot from '../../../../Bot.js';
import Interaction from '../../../Interaction.js';
import Autocompletable from '../../Autocompletable.js';

/**
 * Handler for say slash command. Sends a message with the given input
 */
class Say extends Autocompletable {
    /**
     * @param client The Discord client
     * @param name The name of this slash command
     */
    constructor(client: Bot, name = 'say') {
        super(client, name);
    }

    /**
     * @returns The data that describes the command format to the Discord API
     */
    override getData() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Sends a message with the given input')
            .addStringOption((option) => option.setName('message')
                .setDescription('The message to send')
                .setRequired(true))
            .addStringOption((option) => option.setName('replyto')
                .setDescription('How to reply to this interaction, if any')
                .setAutocomplete(true))
            .addBooleanOption((option) => option.setName('ephemeral')
                .setDescription('Whether or not the reply should be ephemeral'));
    }

    /**
     * Handler for autocompletion of an option
     * @param interaction The interaction to autocomplete
     */
    override async autocomplete(interaction: AutocompleteInteraction) {
        const focusedValue = interaction.options.getFocused();
        // three options
        const choices = ['Interaction', 'None', 'Enter message id:'];

        // if the user has typed anything, either show only the message id prompt or everything but
        // the message id prompt
        if (focusedValue.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const msgIdOption: string = choices.pop()!;
            if (/^\d+$/.test(focusedValue)) { // test if string contains only numbers
                await interaction.respond(
                    [{ name: msgIdOption, value: focusedValue }],
                );
            }
        }
        const filtered = choices.filter(
            (choice) => choice.toLowerCase().startsWith(focusedValue.toLowerCase()),
        );
        if (!interaction.responded) {
            await interaction.respond(
                filtered.map((choice) => ({ name: choice, value: choice })),
            );
        }
    }

    /**
     * Method to run when this slash command is executed
     * @param interaction The interaction that was emitted when this slash command was executed
     */
    override async run(interaction: ChatInputCommandInteraction) {
        const message = interaction.options.getString('message', true).replace('\\n', '\n');
        const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;

        // if ephemeral is true, override the replyto choice with 'Interaction'
        const replyTo = ephemeral ? 'Interaction' : interaction.options.getString('replyto', true);

        // send the message according to the parameters
        if (replyTo === 'Interaction') {
            await interaction.reply({ content: message, ephemeral });
        } else if (!replyTo || replyTo === 'None') {
            const channel = await Interaction.resolveChannel(interaction, this.client);

            if (!channel) {
                await interaction.reply({
                    content: 'Unable to resolve channel for the reply',
                    ephemeral: true,
                });
                return;
            }

            await channel.send(message);
            await interaction.reply('Sent!');
        } else if (/^\d+$/.test(replyTo)) { // replyTo consists of only numbers, which we interpret as a message id
            const channel = await Interaction.resolveChannel(interaction, this.client);

            if (!channel) {
                await interaction.reply({
                    content: 'Unable to resolve channel for the reply',
                    ephemeral: true,
                });
                return;
            }

            try {
                const msgToReplyTo = await channel.messages.fetch(replyTo);
                await msgToReplyTo.reply(message);
                await interaction.reply('Sent!');
            } catch {
                await interaction.reply({
                    content: `Message not found in this channel for id ${replyTo}.`,
                    ephemeral: true,
                });
            }
        } else {
            await interaction.reply({
                content: `Invalid input '${replyTo}' for replyto. Should be one of the options or a message id.`,
                ephemeral: true,
            });
        }
    }
}

export default Say;
