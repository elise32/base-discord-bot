import { BaseInteraction, Events } from 'discord.js';

import Bot from '../Bot.js';
import { verbose } from '../config/out.js';
import Event from '../Event.js';
import Autocompletable from '../interactions/commands/Autocompletable.js';
import TakesArguments from '../interactions/TakesArguments.js';

/**
 * Handler for interactionCreate event
 */
class InteractionCreate extends Event {
    /**
     * @param client The Discord client that will handle the event
     * @param name The name of the event
     */
    constructor(client: Bot, name: Events = Events.InteractionCreate) {
        super(client, name);
    }

    /**
     * Looks up the interaction from the interaction's client and runs it.
     * @param interaction The interaction whose creation triggered this event
     */
    override async run(interaction: BaseInteraction) {
        if (interaction.isChatInputCommand()) { // slash commands
            const { commandName } = interaction;
            const command = this.client.getSlashCommand(commandName);

            verbose(`${interaction.user.tag} ran slash command ${commandName}, options:`, interaction.options.data);

            await command.run(interaction);
        } else if (interaction.isContextMenuCommand()) { // context menu commands
            const { commandName } = interaction;
            const command = this.client.getContextMenuCommand(commandName);

            if (interaction.isUserContextMenuCommand()) {
                verbose(`${interaction.user.tag} ran context menu command ${commandName}, target user:`, interaction.targetUser);
            } else if (interaction.isMessageContextMenuCommand()) {
                verbose(`${interaction.user.tag} ran context menu command ${commandName}, target message:`, interaction.targetMessage);
            } else {
                verbose(`${interaction.user.tag} ran context menu command ${commandName}, target unknown`);
            }

            await command.run(interaction);
        } else if (interaction.isButton()) { // buttons
            const [customId, ...args] = TakesArguments.tokenize(interaction.customId);
            const button = this.client.getButton(customId);

            verbose(`${interaction.user.tag} ran button ${customId}, args:`, args);

            await button.run(interaction, ...args);
        } else if (interaction.isAnySelectMenu()) { // select mens
            const [customId, ...args] = TakesArguments.tokenize(interaction.customId);
            const selectMenu = this.client.getSelectMenu(customId);

            verbose(`${interaction.user.tag} ran select menu ${customId}, args:`, args, ', values:', interaction.values);

            await selectMenu.run(interaction, ...args);
        } else if (interaction.isModalSubmit()) { // modals
            const [customId, ...args] = TakesArguments.tokenize(interaction.customId);
            const modal = this.client.getModal(customId);

            verbose(`${interaction.user.tag} ran modal submit ${customId}, args:`, args, ', values:', interaction.fields.fields);

            await modal.run(interaction, ...args);
        } else if (interaction.isAutocomplete()) { // autocomplete
            const { commandName } = interaction;
            const command = this.client.getSlashCommand(commandName);

            verbose(`${interaction.user.tag} ran autocomplete for command ${commandName}: ${interaction.options.getFocused()}`);

            if (!(command instanceof Autocompletable)) {
                throw new TypeError('Command that received autocomplete interaction was not an Autocompletable');
            }

            await command.autocomplete(interaction);
        }
    }
}

export default InteractionCreate;
