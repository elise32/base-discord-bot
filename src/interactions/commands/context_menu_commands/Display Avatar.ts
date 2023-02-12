import {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    UserContextMenuCommandInteraction,
} from 'discord.js';

import Bot from '../../../Bot.js';
import ContextMenuCommand from '../ContextMenuCommand.js';

/**
 * Handler for Display Avatar user context menu command. Displays the avatar of the user.
 */
class DisplayAvatar extends ContextMenuCommand {
    /**
     * @param client The Discord client
     * @param name The name of this context menu command
     */
    constructor(client: Bot, name = 'Display Avatar') {
        super(client, name);
    }

    /**
     * @returns The data that describe the command format to the Discord API
     */
    override getData() {
        return new ContextMenuCommandBuilder()
            .setName(this.name)
            .setType(ApplicationCommandType.User);
    }

    /**
     * Method to run when this context menu command is executed
     * @param interaction The interaction that was emitted when this command was executed
     */
    override async run(interaction: UserContextMenuCommandInteraction) {
        await interaction.reply({
            content: `${interaction.user.username} wanted to see ${interaction.targetUser.displayAvatarURL()}`,
            ephemeral: true,
        });
    }
}

export default DisplayAvatar;
