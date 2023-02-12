import Bot from '../../../../Bot.js';
import SlashCommandWithSubcommands from '../../SlashCommandWithSubcommands.js';

/**
 * Handler for stop slash command. Demonstration of subcommands and subcommand groups
 */
class Stop extends SlashCommandWithSubcommands {
    /**
     * @param client The Discord client
     * @param name The name of this slash command
     */
    constructor(client: Bot, name = 'stop') {
        super(client, name);
    }
}

export default Stop;
