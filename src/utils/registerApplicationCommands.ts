import { REST } from '@discordjs/rest';
import { APIApplicationCommand, Routes, Snowflake } from 'discord.js';

import config from '../config/config.js';
import { verbose } from '../config/out.js';
import ApplicationCommand from '../interactions/commands/ApplicationCommand.js';

// courtesy of
// https://discordjs.guide/creating-your-bot/command-deployment.html#command-registration and
// https://discordjs.guide/slash-commands/deleting-commands.html
const { clientId, token } = config;

/**
 * Deletes all application commands, either in a specific guild or globally based on the parameters.
 * @param guildId The id of the guild to delete a guild command in. Will delete commands globally if
 *     unspecified
 */
async function deleteAllApplicationCommands(guildId?: Snowflake) {
    verbose('Deleting application commands: guildId set to', guildId);

    const rest = new REST({ version: '10' }).setToken(token);

    if (guildId) { // for guild-based commands
        console.log(`Started to delete application commands in guild ${guildId}.`);
        try {
            await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
            console.log(`Successfully deleted all guild commands in guild ${guildId}.`);
        } catch (error) {
            console.error(error);
        }
    } else { // for global commands
        console.log('Started to delete application commands.');
        try {
            await rest.put(Routes.applicationCommands(clientId), { body: [] });
            console.log('Successfully deleted all application commands.');
        } catch (error) {
            console.error(error);
        }
    }

    verbose('Done deleting commands');
}

/**
 * Deletes a specific application command, either in a specified guild or globally based on the
 * parameters.
 * @param commandId The id of the command to delete (see
 *     https://discordjs.guide/slash-commands/deleting-commands.html#deleting-specific-commands)
 * @param guildId The id of the guild to delete a guild command in. Will delete commands globally if
 *     unspecified
 */
async function deleteApplicationCommand(commandId: Snowflake, guildId?: Snowflake) {
    const rest = new REST({ version: '10' }).setToken(token);

    if (guildId) { // for guild-based commands
        console.log(`Started to delete application command with id: ${commandId} in guild ${guildId}.`);
        try {
            await rest.delete(Routes.applicationGuildCommand(clientId, guildId, commandId));
            console.log(`Successfully deleted guild command ${commandId} in guild ${guildId}.`);
        } catch (error) {
            console.error(error);
        }
    } else { // for global commands
        console.log(`Started to delete application command with id: ${commandId}.`);
        try {
            await rest.delete(Routes.applicationCommand(clientId, commandId));
            console.log(`Successfully deleted application command ${commandId}.`);
        } catch (error) {
            console.error(error);
        }
    }
}

interface ApplicationCommandMappable {
    map<T>(fn: (value: ApplicationCommand) => T): T[];
}

/**
 * Registers the application commands (slash commands or context menu commands) of the bot, either
 * in a specified guild or globally. Must be used when updating properties of application commands
 * for the change to be reflected in the guilds, but otherwise unnecessary for normal operation.
 * @param commands A collection that contains the registration data
 * @param guildId Specifies a guild to load commands into; commands will be registered globally if
 *     unspecified
 */
async function registerApplicationCommands(
    commands: ApplicationCommandMappable,
    guildId?: Snowflake,
) {
    verbose('Registering application commands: guildId set to', guildId);
    verbose('Application commands to register:');
    verbose(commands);

    const commandsData = commands.map((command) => command.toJSON());

    const rest = new REST({ version: '10' }).setToken(token);

    if (guildId) { // for guild-based commands
        console.log(`Started registering ${commandsData.length} application commands in guild ${guildId}.`);
        try {
            const data = await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commandsData },
            ) as APIApplicationCommand[];
            console.log(`Successfully registered ${data.length} application commands in guild ${guildId}.`);
        } catch (error) {
            console.error(error);
        }
    } else { // for global commands
        console.log(`Started registering ${commandsData.length} application commands.`);
        try {
            const data = await rest.put(
                Routes.applicationCommands(clientId),
                { body: commandsData },
            ) as APIApplicationCommand[];
            console.log(`Successfully registered ${data.length} application commands.`);
        } catch (error) {
            console.error(error);
        }

        verbose('Done registering application commands');
    }
}

export {
    deleteAllApplicationCommands, deleteApplicationCommand, registerApplicationCommands,
};
