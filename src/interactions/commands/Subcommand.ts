import { SlashCommandSubcommandBuilder } from 'discord.js';

import ApplicationCommand from './ApplicationCommand.js';

/**
 * Parent class for subcommand handlers.
 */
abstract class Subcommand extends ApplicationCommand {
    abstract override getData(): SlashCommandSubcommandBuilder;
}

export default Subcommand;
