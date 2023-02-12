import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import fs from 'fs';

import Bot from '../../../../Bot.js';
import SlashCommand from '../../SlashCommand.js';

/**
 * Handler for version slash command. Retrieves the version (currently from package.json)
 */
class Version extends SlashCommand {
    /**
     * @param client The Discord client
     * @param name The name of this slash command
     */
    constructor(client: Bot, name = 'version') {
        super(client, name);
    }

    /**
     * @returns {SlashCommandBuilder} The data that describes the command format to the Discord API
     */
    getData() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Get bot version');
    }

    /**
     * Method to run when this slash command is executed
     * @param interaction The interaction that was emitted when this
     *     slash command was executed
     */
    async run(interaction: ChatInputCommandInteraction) {
        const data = JSON.parse(
            (await fs.promises.readFile('./package.json')).toString(),
        ) as { version?: string };

        await interaction.reply({
            content: `Current version is ${data.version ?? 'unknown'}`,
            ephemeral: true,
        });
    }
}

export default Version;
