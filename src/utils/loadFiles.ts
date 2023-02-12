import { Collection } from 'discord.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

import Bot from '../Bot.js';
import { verbose } from '../config/out.js';
import Event from '../Event.js';
import Handler from '../Handler.js';
import ContextMenuCommand from '../interactions/commands/ContextMenuCommand.js';
import SlashCommand from '../interactions/commands/SlashCommand.js';
import SlashCommandWithSubcommands, {
    SlashCommandChild,
} from '../interactions/commands/SlashCommandWithSubcommands.js';
import Subcommand from '../interactions/commands/Subcommand.js';
import Button from '../interactions/message_components/Button.js';
import SelectMenu from '../interactions/message_components/SelectMenu.js';
import Modal from '../interactions/Modal.js';
import { DuplicateElementError } from './errors.js';

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// default paths to use to search for files
const eventsPath = '../events';
const contextMenuCommandsPath = '../interactions/commands/context_menu_commands';
const slashCommandsPath = '../interactions/commands/slash_commands';
const subcommandsPath = '../interactions/commands/subcommands';
const buttonsPath = '../interactions/message_components/buttons';
const selectMenusPath = '../interactions/message_components/select_menus';
const modalsPath = '../interactions/modals';

/**
 * Recursively loads files in the given directory and instantiates them. Instances are then inserted
 * into the given collection with the instance's name property mapping to the instance.
 * @param collection The collection to populate with class instances
 * @param dir The directory to search on this level
 * @param callback The function to call after an instantiation, with the instance passed as a
 *     parameter along with the instanceArgs
 * @throws {Error} If files could not be read from the directory
 * @throws {Error} If an instance of a file's default export does not have a name property
 * @throws {Error} If an instance of a file's default export does not have a name property
 * @throws {DuplicateElementError} If the collection has an element with a key matching the name
 *     property of an instance
 */
async function loadNameable<T extends Handler>(
    collection: Collection<string, T>,
    client: Bot,
    dir: string,
    callback?: (instance: T, ...args: unknown[]) => void | Promise<void>,
) {
    const dirPath = path.join(__dirname, dir);

    const files = await fs.readdir(dirPath).catch((error) => {
        throw new Error(
            `Couldn't load files: promise rejection when loading files for ${dirPath} (resolved from ${dir})`,
            { cause: error },
        );
    });
    await Promise.all(
        files.map(async (fileName) => {
            const filePath = path.join(dirPath, fileName);
            const relativeFilePath = path.join(dir, fileName);

            const stat = await fs.lstat(filePath);
            if (stat.isDirectory()) {
                await loadNameable(collection, client, relativeFilePath, callback);
            } else if (fileName.endsWith('.js')) {
                verbose(`Loading ${relativeFilePath}`);

                // const Class = (await import(pathToFileURL(filePath).toString())).default;
                interface HandlerModule {
                    default?: new (instanceClient: Bot, ...args: unknown[]) => T
                }

                const Class = (
                    (await import(pathToFileURL(filePath).toString()) as HandlerModule).default
                );

                if (!Class) {
                    throw new Error(`No default export found in ${relativeFilePath}`);
                }
                if (!(Class.prototype && Class.prototype instanceof Handler)) {
                    throw new Error(`Default export of ${relativeFilePath} was not a Handler!`);
                }

                const instance = new Class(client);

                if (collection.has(instance.name)) {
                    throw new DuplicateElementError(filePath, instance.name, collection);
                }
                collection.set(instance.name, instance);

                if (callback) {
                    await callback(instance);
                }
            }
        }),
    );
}

/**
 * Recursively fetch and load event files into the collection.
 * @param collection The collection to populate with loaded events
 * @param client The client to pass to each event on construction
 * @param dir The directory to search on this level
 */
async function loadEvents(
    collection: Collection<string, Event>,
    client: Bot,
    dir: string = eventsPath,
) {
    verbose('Loading events');
    await loadNameable(
        collection,
        client,
        dir,
        (event) => {
            event.startListener();
        },
    );
    verbose('Done loading events');
}

/**
 * Recursively fetch and load slash command files into the collection.
 * @param collection The collection to populate with loaded slash commands
 * @param dir The directory to search on this level
 */
async function loadSlashCommands(
    collection: Collection<string, SlashCommand>,
    client: Bot,
    dir: string = slashCommandsPath,
) {
    verbose('Loading slash commands');
    await loadNameable(collection, client, dir);
    verbose('Done loading slash commands');
}

/**
 * Recursively fetch and load button files into the collection.
 * @param collection The collection to populate with loaded button classes
 * @param dir The directory to search on this level
 */
async function loadButtons(
    collection: Collection<string, Button>,
    client: Bot,
    dir: string = buttonsPath,
) {
    verbose('Loading buttons');
    await loadNameable(collection, client, dir);
    verbose('Done loading buttons');
}

/**
 * Recursively fetch and load button files into the collection.
 * @param collection The collection to populate with loaded button classes
 * @param dir The directory to search on this level
 */
async function loadSelectMenus(
    collection: Collection<string, SelectMenu>,
    client: Bot,
    dir: string = selectMenusPath,
) {
    verbose('Loading select menus');
    await loadNameable(collection, client, dir);
    verbose('Done loading select menus');
}

/**
 * Recursively fetch and load button files into the collection.
 * @param collection The collection to populate with loaded button classes
 * @param dir The directory to search on this level
 */
async function loadModals(
    collection: Collection<string, Modal>,
    client: Bot,
    dir: string = modalsPath,
) {
    verbose('Loading modals');
    await loadNameable(collection, client, dir);
    verbose('Done loading modals');
}

/**
 * Recursively fetch and load button files into the collection.
 * @param collection The collection to populate with loaded button classes
 * @param dir The directory to search on this level
 */
async function loadContextMenuCommands(
    collection: Collection<string, ContextMenuCommand>,
    client: Bot,
    dir: string = contextMenuCommandsPath,
) {
    verbose('Loading context menu commands');
    await loadNameable(collection, client, dir);
    verbose('Done loading context menu commands');
}

/**
 * Helper function that does the actual the loading of commands
 * @param collection The collection to put subcommands into
 * @param dir The directory to search for files
 * @param inGroup Whether this function call is in directory that represents a subcommand group
 */
async function loadSubcommandsActually(
    collection: Collection<string, SlashCommandChild>,
    client: Bot,
    dir: string,
    inGroup = false,
) {
    const dirPath = path.join(__dirname, dir);
    const files = await fs.readdir(dirPath).catch((error) => {
        throw new Error(
            `Couldn't load files: promise rejection when loading files for ${dirPath} (resolved from ${dir})`,
            { cause: error },
        );
    });
    await Promise.all(
        files.map(async (fileName) => {
            const filePath = path.join(dirPath, fileName);
            const relativeFilePath = path.join(dir, fileName);
            const stat = await fs.lstat(filePath);
            if (stat.isDirectory() && !inGroup) { // directory represents a subcommand group
                if (collection.has(fileName)) {
                    throw new DuplicateElementError(dirPath, fileName, collection);
                }
                const groupCommands = new Collection<string, Subcommand>();
                await loadSubcommandsActually(
                    groupCommands,
                    client,
                    relativeFilePath,
                    true,
                );
                collection.set(fileName, groupCommands);
            } else if (fileName.endsWith('.js')) {
                verbose(`Loading ${relativeFilePath}`);

                interface SubcommandModule {
                    default?: new (instanceClient: Bot, ...args: unknown[]) => Subcommand
                }

                const Class = (
                    (await import(pathToFileURL(filePath).toString()) as SubcommandModule).default
                );

                if (!Class) {
                    throw new Error(`No default export found in ${relativeFilePath}`);
                }
                if (!(Class.prototype && Class.prototype instanceof Handler)) {
                    throw new Error(`Default export of ${relativeFilePath} was not a Handler!`);
                }

                const cmd = new Class(client);
                if (collection.has(cmd.name)) {
                    throw new DuplicateElementError(filePath, cmd.name, collection);
                }
                collection.set(cmd.name, cmd);
            }
        }),
    );
}

/**
 * Loads subcommands and subcommand groups into the commands in the given collection. Subcommand
 * groups are represented as a collection with its respective subcommands as elements. A command is
 * detected when a folder within the given subcommand directory has given command name. Currently
 * only supports commands that are directly in the subcommand directory.
 * @param commands The collection that contains the commands to load subcommands into
 * @param dir The directory to search for subcommands
 */
async function loadSubcommands(
    commands: Collection<string, SlashCommand>,
    client: Bot,
    dir: string = subcommandsPath,
) {
    verbose('Loading subcommands');

    // commands validity checking
    if (commands.size === 0) {
        throw new RangeError('Cannot load subcommands: size of commands is 0 (zero, not one you smart aleck)');
    }

    // get files within subcommands directory
    const dirPath = path.join(__dirname, dir);
    const files = await fs.readdir(dirPath).catch((error) => {
        throw new Error(
            `Couldn't load files: promise rejection when loading files for ${dirPath} (resolved from ${dir})`,
            { cause: error },
        );
    });
    await Promise.all(
        files.map(async (fileName) => {
            // try to match a directory name with a command name
            const stat = await fs.lstat(path.join(dirPath, fileName));
            if (stat.isDirectory()) {
                // get command with matching name
                const command = commands.get(fileName);

                // check command validity
                if (!command) {
                    throw new Error(`Found directory ${fileName} in ${dirPath}, but ${fileName} does not match the name of any commands`);
                }
                if (!(command instanceof SlashCommandWithSubcommands)) {
                    throw new TypeError(`Retrieved command for key ${fileName} but the value was not of type SlashCommandWithSubcommand`);
                }

                // create and populate children
                const children = new Collection<string, SlashCommandChild>();
                await loadSubcommandsActually(children, client, path.join(dir, fileName));

                // apply children to command
                command.addChildren(children);
            } else { // file is not a directory, so it's a file
                console.error(`Warning: found file ${fileName} directly in ${dirPath} while looking for subcommands. Subcommands are expected to be found within a subdirectory of the subcommands directory.`);
            }
        }),
    );
    verbose('Done loading subcommands');
}

export {
    loadEvents,
    loadSlashCommands,
    loadSubcommands,
    loadButtons,
    loadSelectMenus,
    loadContextMenuCommands,
    loadModals,
};
