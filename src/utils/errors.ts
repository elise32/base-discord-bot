// this file is to store various error classes
/* eslint-disable max-classes-per-file */
import { Collection } from 'discord.js';

import Interaction from '../interactions/Interaction.js';

class LookupError extends Error {
    /**
     * Exception to be thrown when a query had no result or an improper result
     * @param type The type of result that was being searched for
     * @param query The query that was not found
     * @param source Where the query was searching
     */
    constructor(type: string, query: string, source: Iterable<unknown>) {
        super(`Tried to lookup ${type} with query '${query}' but it was not found!`, { cause: { type, query, source } });
    }
}

interface CommandChildNotFoundInfo {
    /**
     * The name of the subcommand group of the command
     */
    group?: string | null;
    /**
     * The name of the subcommand of the command or group
     */
    subcommand?: string | null;
    /**
     * Will make the error display the group if the subcommand exists. Useful for when you want to
     * pass both the subcommand group and subcommand and the group was the missing element.
     */
    isGroupTheMissingOne?: boolean;
}

class CommandChildNotFoundError extends Error {
    /**
     * Exception to be thrown when a subcommand or subcommand group of a slash command is looked up
     * but it was not found. Displays the command as well as, if given, the subcommand and
     * subcommand group. If you may want to pass the subcommand as well as the subcommand group but
     * the group was the property whose lookup failed, that is what info.isGroupTheMissingOne is
     * for.
     * @param command The name of the command whose running caused this exception
     * @param info The details of the failed command

     */
    constructor(
        command: string,
        { group, subcommand, isGroupTheMissingOne = false }: CommandChildNotFoundInfo,
    ) {
        // pad the names for proper spaces in message
        const groupStr = group ? ` ${group}` : '';
        const subcommandStr = subcommand ? ` ${subcommand}` : '';

        const message = `Tried to lookup '/${command}${groupStr}${subcommandStr}' but ${subcommand && !isGroupTheMissingOne ? `subcommand '${subcommand}'` : `group '${group}'`} was not found.`;

        super(message);
    }
}

class DuplicateElementError<K, V> extends Error {
    constructor(path: string, name: string, collection: Collection<K, V>) {
        const keys = collection.map((value, key) => key);
        super(`Found duplicate while loading files: ${name} found at ${path}! Existing keys of collection: ${keys}`);
    }
}

class DataError extends Error {
    constructor(message: string, instance: Interaction) {
        super(message, { cause: { instance } });
    }
}

class FatalError extends Error {

}

export {
    LookupError,
    CommandChildNotFoundInfo,
    CommandChildNotFoundError,
    DuplicateElementError,
    DataError,
    FatalError,
};
