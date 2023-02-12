import Bot from '../../../../Bot.js';
import SlashCommandWithSubcommands from '../../SlashCommandWithSubcommands.js';

/**
 * Handler for example slash command. Creates various examples
 */
class Example extends SlashCommandWithSubcommands {
    /**
     * @param client The Discord client
     * @param name The name of this slash command
     */
    constructor(client: Bot, name = 'example') {
        super(client, name);
    }
}

export default Example;
