import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

import Bot from '../../../../Bot.js';
import SlashCommand from '../../SlashCommand.js';

/**
 * Handler for questionnaire slash command. Allows the user to fill out a questionnaire. For the
 * purpose of demonstrating all the different types of command options. Courtesy of
 * https://discordjs.guide/interactions/slash-commands.html#parsing-options
 */
class Questionnaire extends SlashCommand {
    /**
     * @param client The Discord client
     * @param name The name of this slash command
     */
    constructor(client: Bot, name = 'questionnaire') {
        super(client, name);
    }

    /**
     * @returns The data that describes the command format to the Discord API
     */
    override getData() {
        // these options that encompass all option types
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Asks you a series of questions!')
            .addStringOption((option) => option.setName('input').setDescription('Your name?'))
            .addBooleanOption((option) => option.setName('bool').setDescription('True or False?'))
            .addUserOption((option) => option.setName('target').setDescription('Closest friend?'))
            .addChannelOption((option) => option.setName('destination').setDescription('Favourite channel?'))
            .addRoleOption((option) => option.setName('role').setDescription('Least favourite role?'))
            .addIntegerOption((option) => option.setName('int').setDescription('Sides to a square?'))
            .addNumberOption((option) => option.setName('num').setDescription('Value of Pi?'))
            .addMentionableOption((option) => option.setName('mentionable').setDescription('Mention something!'))
            .addAttachmentOption((option) => option.setName('attachment').setDescription('Best meme?'));
    }

    /**
     * Method to run when this slash command is executed
     * @param interaction The interaction that was emitted when this
     *     slash command was executed
     */
    override async run(interaction: ChatInputCommandInteraction) {
        // parse all options
        const string = interaction.options.getString('input');
        const boolean = interaction.options.getBoolean('bool');
        const user = interaction.options.getUser('target');
        const member = interaction.options.getMember('target');
        const channel = interaction.options.getChannel('destination');
        const role = interaction.options.getRole('role');
        const integer = interaction.options.getInteger('int');
        const number = interaction.options.getNumber('num');
        const mentionable = interaction.options.getMentionable('mentionable');
        const attachment = interaction.options.getAttachment('attachment');

        const answers = {
            string, boolean, user, member, channel, role, integer, number, mentionable, attachment,
        };

        // output all the parsed result of all the options that were entered
        console.log(answers);
        await interaction.reply({ content: Object.values(answers).join(', '), ephemeral: true });
    }
}

export default Questionnaire;
