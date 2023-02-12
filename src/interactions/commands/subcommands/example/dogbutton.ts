import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    CollectedInteraction,
    MessageActionRowComponentBuilder,
    SlashCommandSubcommandBuilder,
} from 'discord.js';
import { setTimeout as wait } from 'node:timers/promises';

import Bot from '../../../../Bot.js';
import Interaction from '../../../Interaction.js';
import Subcommand from '../../Subcommand.js';

/**
 * Handler for dogbutton subcommand. Example for monolithically creating an example button,
 * receiving button presses, and handling the button press(es).
 */
class DogButton extends Subcommand {
    /**
     * @param client The Discord client
     * @param name The name of this subcommand
     */
    constructor(client: Bot, name = 'dogbutton') {
        super(client, name);
    }

    /**
     * @returns The data that describes the command format to the Discord API
     */
    getData() {
        return new SlashCommandSubcommandBuilder()
            .setName(this.name)
            .setDescription('Creates a button and responds to it');
    }

    /**
     * Method to run when this subcommand is executed
     * @param interaction The interaction that was emitted when the slash command was executed
     */
    async run(interaction: ChatInputCommandInteraction) {
        // make filter for collector and make collector
        const channel = await Interaction.resolveChannel(interaction, this.client);
        if (!channel) {
            await interaction.reply({
                content: 'Unable to resolve channel for this interaction',
                ephemeral: true,
            });
            return;
        }

        const filter = (i: CollectedInteraction) => i.customId === 'primary'
            && i.user.id === '274206665241395202';

        const collector = channel.createMessageComponentCollector(
            { filter, time: 15000 },
        );

        collector.on('collect', async (i) => {
            await i.deferUpdate();
            await wait(4000);
            await i.editReply({ content: 'A button was clicked!', components: [] }); // empty components removes buttons
        });

        collector.on('end', (collected) => console.log(`Collected ${collected.size} items`));

        // make message
        // make button
        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('primary')
                    .setLabel('​') // zero width space so emoji is centered
                    .setStyle(ButtonStyle.Primary)
                    // .setDisabled(true)
                    .setEmoji('1000617650419929120'), // dog wave emoji
            );
        await interaction.reply({ content: 'Dogge', ephemeral: true, components: [row] });
    }
}

export default DogButton;
