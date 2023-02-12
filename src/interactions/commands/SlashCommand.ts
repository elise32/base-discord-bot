import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';

import ApplicationCommand from './ApplicationCommand.js';

/**
 * Parent class for slash command handlers.
 */
abstract class SlashCommand extends ApplicationCommand {
    abstract override getData():
        Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
        | SlashCommandSubcommandsOnlyBuilder;
}

export default SlashCommand;
