import { Client, Collection, Snowflake } from 'discord.js';

import { verbose } from './config/out.js';
import Event from './Event.js';
import ApplicationCommand from './interactions/commands/ApplicationCommand.js';
import ContextMenuCommand from './interactions/commands/ContextMenuCommand.js';
import SlashCommand from './interactions/commands/SlashCommand.js';
import Button from './interactions/message_components/Button.js';
import SelectMenu from './interactions/message_components/SelectMenu.js';
import Modal from './interactions/Modal.js';
import { LookupError } from './utils/errors.js';
import {
    loadButtons,
    loadContextMenuCommands,
    loadEvents,
    loadModals,
    loadSelectMenus,
    loadSlashCommands,
    loadSubcommands,
} from './utils/loadFiles.js';
import {
    deleteAllApplicationCommands,
    registerApplicationCommands,
} from './utils/registerApplicationCommands.js';

/**
 * @param registerCommands Will register application commands if true,
 *     do nothing otherwise
 * @param clean Will clear all application commands if true. Will
 *     clear only global commands if guildId is not set or will clear only commands in the
 *     specified guild if guildId is set. This happens before registration of commands
 * @param guildId Specifies a guild to clear application commands
 *     from.
 */
interface BotStartOptions {
    registerCommands?: boolean;
    clean?: boolean
    guildId?: Snowflake
}

class Bot extends Client {
    // these collections are populated as a map with the name of the event/slash command/etc. as the
    // key and an instance of its respective class as the value
    #events = new Collection<string, Event>();

    #slashCommands = new Collection<string, SlashCommand>();

    #buttons = new Collection<string, Button>();

    #selectMenus = new Collection<string, SelectMenu>();

    #modals = new Collection<string, Modal>();

    #contextMenuCommands = new Collection<string, ContextMenuCommand>();

    /**
     * Run this function to get the bot going. Loads the necessary files to populate the members of
     * the Bot, connects to Discord using the Discord API, then optionally registers application
     * commands
     * @param token The OAuth2 token to use to log in to the bot (see
     *     https://discord.com/developers/docs/topics/oauth2#bots)
     * @param options The options to be used while starting the bot
     */
    async start(token: string, { registerCommands, clean, guildId }: BotStartOptions = {}) {
        // load files
        verbose('Starting client');

        // init
        verbose('----------- Loading files -----------');
        await Promise.all([
            loadSlashCommands(this.#slashCommands).then(async () => {
                await loadSubcommands(this.#slashCommands);
            }),
            loadContextMenuCommands(this.#contextMenuCommands),
            loadButtons(this.#buttons),
            loadSelectMenus(this.#selectMenus),
            loadModals(this.#modals),
            loadEvents(this.#events, this),
        ]);
        verbose('--------- Done loading files --------');

        // command registration
        if (clean) {
            await deleteAllApplicationCommands(guildId);
        }
        if (registerCommands) {
            await this.registerCommands(new Collection<string, ApplicationCommand>().concat(
                this.#slashCommands,
                this.#contextMenuCommands,
            ));
        }

        // login
        verbose('Logging in to Discord...');

        await super.login(token);

        verbose('Done logging in to Discord');
    }

    /**
     * Registers application commands to Discord
     * @param commands The commands to register
     */
    async registerCommands(commands: Collection<string, ApplicationCommand>) {
        const globals: ApplicationCommand[] = [];
        const guilds = new Collection<Snowflake, ApplicationCommand[]>(); // maps guild id => guild's commands

        // iterate through commands and put them either in globals or an entry for that guild
        commands.forEach((command) => {
            if (command.guild) {
                const existingEntry: ApplicationCommand[] | undefined = guilds.get(command.guild);
                if (existingEntry) {
                    existingEntry.push(command);
                    return;
                }

                guilds.set(command.guild, [command]);
            } else {
                globals.push(command);
            }
        });

        // register global and guild commands
        await registerApplicationCommands(globals);
        await Promise.all(
            guilds.map(
                (guildCommands, guild) => registerApplicationCommands(guildCommands, guild),
            ),
        );
    }

    /**
     * Retrieves the slash command that matches the given name.
     * @param slashCommandName The name matching the SlashCommand.name field
     * @returns The slash command that has a name matching SlashCommandName
     */
    getSlashCommand(slashCommandName: string): SlashCommand {
        const command = this.#slashCommands.get(slashCommandName);

        if (!command) {
            throw new LookupError(
                `Tried to lookup '/${slashCommandName}' but it was not found! (psst: try deleting commands that are registered but no longer exist or updating commands)`,
                slashCommandName,
                this.#slashCommands,
            );
        }

        return command;
    }

    /**
     * Retrieves the button that matches the given name (which should match the customId).
     * @param buttonName The name matching the Button.name field
     * @returns The button that has a name matching buttonName
     */
    getButton(buttonName: string): Button {
        const button = this.#buttons.get(buttonName);

        if (!button) {
            throw new LookupError('button', buttonName, this.#buttons);
        }

        return button;
    }

    /**
     * Retrieves the selectMenu that matches the given name (which should match the customId).
     * @param selectMenuName The name matching the SelectMenu.name field
     * @returns The button that has a name matching selectMenuName
     */
    getSelectMenu(selectMenuName: string): SelectMenu {
        const selectMenu = this.#selectMenus.get(selectMenuName);

        if (!selectMenu) {
            throw new LookupError(
                'select menu',
                selectMenuName,
                this.#selectMenus,
            );
        }

        return selectMenu;
    }

    /**
     * Retrieves the modal that matches the given name (which should match the customId).
     * @param modalName The name matching the Modal.name field
     * @returns The modal that has a name matching modalName
     */
    getModal(modalName: string): Modal {
        const modal = this.#modals.get(modalName);

        if (!modal) {
            throw new LookupError('modal', modalName, this.#modals);
        }

        return modal;
    }

    /**
     * Retrieves the context menu that matches the given name
     * @param contextMenuName The name matching the ContextMenu.name field
     * @returns The context menu that has a name matching contextMenuName
     */
    getContextMenuCommand(contextMenuName: string): ContextMenuCommand {
        const contextMenuCommand = this.#contextMenuCommands.get(contextMenuName);

        if (!contextMenuCommand) {
            throw new LookupError(
                'context menu command',
                contextMenuName,
                this.#contextMenuCommands,
            );
        }

        return contextMenuCommand;
    }
}

export default Bot;
export { BotStartOptions };
