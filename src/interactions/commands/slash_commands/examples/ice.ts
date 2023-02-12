import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

import Bot from '../../../../Bot.js';
import SlashCommand from '../../SlashCommand.js';

/**
 * Handler for ice slash command. A demonstration of subcommands and subcommand groups all within
 * one file.
 * @see stop.js for a demonstration of how subcommand[ group]s are handled with separate files
 * within this project.
 */
class Ice extends SlashCommand {
    /**
     * @param client The Discord client
     * @param name The name of this slash command
     */
    constructor(client: Bot, name = 'ice') {
        super(client, name);
    }

    /**
     * @returns The data that describes the command format to the Discord API
     */
    override getData() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Never shown')
            .addSubcommand((subcommand) => subcommand
                .setName('cold')
                .setDescription('Hey ya')
                .addStringOption((option) => option
                    .setName('answer')
                    .setDescription('What\'s cooler than being cool?')))
            .addSubcommandGroup((group) => group
                .setName('ice')
                .setDescription('Never shown')
                .addSubcommand((subcommand) => subcommand
                    .setName('baby')
                    .setDescription('Ice Ice Baby')
                    .addStringOption((option) => option
                        .setName('flavor')
                        .setDescription('The flavor of your ice'))))
            .addSubcommandGroup((group) => group
                .setName('cream')
                .setDescription('Never shown')
                .addSubcommand((subcommand) => subcommand
                    .setName('sandwich')
                    .setDescription('ice cream sandwich')));
    }

    /**
     * Method to run when this slash command is executed
     * @param interaction The interaction that was emitted when this slash command was executed
     */
    override async run(interaction: ChatInputCommandInteraction) {
        let message = 'Default message';
        const groupName = interaction.options.getSubcommandGroup();
        const subcommandName = interaction.options.getSubcommand();
        if (groupName) {
            if (groupName === 'ice' && subcommandName === 'baby') {
                const flavor = interaction.options.getString('flavor', true);
                message = `Your ice is ${flavor} ice`;
            } else if (groupName === 'cream' && subcommandName === 'sandwich') {
                message = 'You got an ice cream sandwich!';
            }
        } else if (subcommandName === 'cold') {
            const answer = interaction.options.getString('answer', true);
            message = `${answer} is cooler than cool`;
        }

        await interaction.reply({ content: message, ephemeral: true });
    }
}

export default Ice;
