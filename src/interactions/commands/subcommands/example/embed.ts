import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandSubcommandBuilder,
} from 'discord.js';

import Bot from '../../../../Bot.js';
import Subcommand from '../../Subcommand.js';

/**
 * Handler for Embed subcommand. Makes an embed to demonstrate embed creation
 */
class Embed extends Subcommand {
    /**
     * @param client The Discord client
     * @param name The name of this subcommand
     */
    constructor(client: Bot, name = 'embed') {
        super(client, name);
    }

    /**
     * @returns The data that describes the command format to the Discord API
     */
    getData() {
        return new SlashCommandSubcommandBuilder()
            .setName(this.name)
            .setDescription('Makes an embed');
    }

    /**
     * Method to run when this subcommand is executed
     * @param interaction The interaction that was emitted when the slash command was executed
     */
    async run(interaction: ChatInputCommandInteraction) {
        // courtesy of https://discordjs.guide/popular-topics/embeds.html
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Some title')
            .setURL('https://discord.js.org/')
            .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
            .setDescription('Some description here')
            .setThumbnail('https://i.imgur.com/AfFp7pu.png')
            .addFields(
                { name: 'Regular field title', value: 'Some value here' },
                { name: '\u200B', value: '\u200B' },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            .addFields(
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            .setImage('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp()
            .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

        await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
    }
}

export default Embed;
