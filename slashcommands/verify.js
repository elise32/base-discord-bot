import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import SlashCommand from '../classes/SlashCommand.js'
import VerifyTicketHandler from '../classes/VerifyTicketHandler.js'

/**
 * Handler for verify slash command. Contains commands that verifiers may use as part of their role.
 */
class Verify extends SlashCommand {
    /**
     * Constructor for Verifier class and instantiates this.data
     * 
     * @param {Client} client The Discord Client that will handle this command
     * @param {string} name The name of this slash command
     */
    constructor(client, name) {
        super(client, name)

        this.data = new SlashCommandBuilder()
            .setName(name)
            .setDescription('Verifier commands')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('history')
                    .setDescription('The user\'s history on this server')
                    .addUserOption(option =>
                        option.setName('target')
                            .setDescription('The user')
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('archive')
                    .setDescription('Archive a verification thread. Must be ran in thread.')
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('timeout')
                    .setDescription('Timeout a user')
                    .addUserOption(option =>
                        option.setName('target')
                            .setDescription('The user')
                    )
                    .addIntegerOption(option =>
                        option.setName('length')
                            .setDescription('How long to timeout the user')
                            .addChoices(
                                { name: '60 sec', value: 60 * 1000 },
                                { name: '5 min', value: 5 * 60 * 1000 },
                                { name: '10 min', value: 10 * 60 * 1000 },
                                { name: '1 hour', value: 1 * 60 * 60 * 1000 },
                                { name: '1 day', value: 1 * 24 * 60 * 60 * 1000 },
                                { name: '1 week', value: 1 * 7 * 24 * 60 * 60 * 1000 },
                            )
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('kick')
                    .setDescription('Kick a user')
                    .addUserOption(option =>
                        option.setName('target')
                            .setDescription('The user')
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('ban')
                    .setDescription('Ban a user')
                    .addUserOption(option =>
                        option.setName('target')
                            .setDescription('The user')
                    )
                    .addIntegerOption(option =>
                        option.setName('length')
                            .setDescription('How long to ban the user')
                            .addChoices(
                                { name: '1 Day', value: 1 * 24 * 60 * 60 * 1000 },
                                { name: '3 Days', value: 3 * 24 * 60 * 60 * 1000 },
                                { name: '7 Days', value: 7 * 24 * 60 * 60 * 1000 },
                                { name: 'Forever', value: -1 },
                            )
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('untimeout')
                    .setDescription('Remove the timeout on a user')
                    .addUserOption(option =>
                        option.setName('target')
                            .setDescription('The user')
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('unban')
                    .setDescription('Unban a user')
                    .addIntegerOption(option =>
                        option.setName('id')
                            .setDescription('The user\'s ID')
                    )
            )
    }

    /**
     * Method to run when this slash command is executed
     * 
     * @param {Interaction} interaction The interaction that was emitted when this slash command was executed
     */
    async run(interaction) {
        if (interaction.options.getSubcommand() === 'history') {
            console.log('history')
        } else if (interaction.options.getSubcommand() === 'archive') {
            const ticketHandler = new VerifyTicketHandler(this.client)

            if (ticketHandler.isVerificationTicket(interaction.channel)) {
                const embed = new EmbedBuilder().setDescription('Archiving thread')
                await interaction.reply({ embeds: [embed] })
                await interaction.channel.setArchived(true)
                // TODO: dummy logger hook
            } else {
                await interaction.reply({ content: `Invalid channel: ${interaction.channel} is not a verification ticket`, ephemeral: true })
            }
        } else if (interaction.options.getSubcommand() === 'timeout') {
            console.log('timeout')
        } else if (interaction.options.getSubcommand() === 'kick') {
            console.log('kick')
        } else if (interaction.options.getSubcommand() === 'ban') {
            console.log('ban')
            console.log(interaction.options.getInteger('length'))
        } else if (interaction.options.getSubcommand() === 'untimeout') {
            console.log('untimeout')
        } else if (interaction.options.getSubcommand() === 'unban') {
            console.log('unban')
        }
    }
}

export default Verify