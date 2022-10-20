// this file is to store various error classes
/* eslint-disable max-classes-per-file */
class LookupError extends Error {
    query;

    source;

    /**
     * Exception to be thrown when a query had no result or an improper result
     * @param {string} query The query that was not found
     * @param {string} source Where the query was searching
     */
    constructor(message, query, source) {
        super(message);
        this.query = query;
        this.source = source;
    }
}

class CommandChildNotFoundException extends Error {
    /**
     * Exception to be thrown when a subcommand or subcommand group of a slash command is looked up but it was not
     * found. Displays the command as well as, if given, the subcommand and subcommand group. If you may want to pass
     * the subcommand as well as the subcommand group but the group was the property whose lookup failed, that is what
     * info.isGroupTheMissingOne is for.
     * @param {string} command The name of the command whose running caused this exception
     * @param {Object} info The details of the failed command
     * @param {string} [info.group=''] The name of the subcommand group of the command
     * @param {string} [info.subcommand=''] The name of the subcommand group of the command
     * @param {boolean} [info.isGroupTheMissingOne=false] Will make the error display the group if the subcommand
     *     exists. Useful for when you want to pass both the subcommand and subcommand group and the group was the
     *     missing element.
     */
    constructor(command, { group = '', subcommand = '', isGroupTheMissingOne = false }) {
        // pad the names for proper spaces in formatting in message
        const groupStr = group ? ` ${group}` : '';
        const subcommandStr = subcommand ? ` ${subcommand}` : '';

        const message = `Tried to lookup '/${command}${groupStr}${subcommandStr}' but ${subcommand && !isGroupTheMissingOne ? `subcommand '${subcommand}'` : `group '${group}'`} was not found.`;

        super(message);
    }
}

class DuplicateElementException extends Error {
    constructor(path, name, collection) {
        const keys = collection.map((value, key) => key);
        super(`Found duplicate while loading files: ${name} found at ${path}! Existing keys of collection: ${keys}`);
    }
}

class DataError extends Error {
    name;

    constructor(message, name) {
        super(message);
        this.name = name;
    }
}

export {
    LookupError,
    CommandChildNotFoundException,
    DuplicateElementException,
    DataError,
};
