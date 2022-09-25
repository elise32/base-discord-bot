import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import SlashCommand from '../classes/SlashCommand.js'
import VerifyTicketHandler from '../classes/VerifyTicketHandler.js'

// const ticketsChannelId = '987230161764225044' // Elise Test Server test channel
const { ticketsChannelId } = VerifyTicketHandler
const leaveArchiveMessage = 'User left - archiving thread'

/**
 * Handler for ping slash command. Replies to the given message with 'pong!'. Can be used to test if the bot is working.
 */
class SimulateLeave extends SlashCommand {
    /**
     * Constructor for Ping class and instantiates this.data
     * 
     * @param {Client} client The Discord Client that will handle this command
     * @param {string} name The name of this slash command
     */
    constructor(client, name) {
        super(client, name)

        this.data = new SlashCommandBuilder()
            .setName(name)
            .setDescription('Simulates thread closing on leave')
    }

    /**
     * Method to run when this slash command is executed
     * 
     * @param {Interaction} interaction The interaction that was emitted when this slash command was executed
     */
    async run(interaction) {

        // const userId = guildMember.user.id
        const userId = '1000178761469268158' // FIXME

        const ticketHandler = new VerifyTicketHandler(this.client)
        const matchingTicketThreads = await ticketHandler.findAllUserTicketThreads(userId)
        const threadToArchive = await ticketHandler.findMostRecentThread(matchingTicketThreads)

        // send message and archive the thread
        // await threadToArchive.send(leaveArchiveMessage) // FIXME
        // await threadToArchive.setArchived(true)
        const embed = new EmbedBuilder()
        embed.setDescription(`Closed thread <#${threadToArchive.id}> (${threadToArchive.id})`)
        if (matchingTicketThreads.size > 1) { // if the user has more than one ticket thread, print out all their ticket threads
            const threadNames = matchingTicketThreads.map((thread) => {
                return `<#${thread.id}>`
            })
            embed.addFields(
                { name: 'All tickets by this user:', value: threadNames.join('\n') }
            )
        }

        await interaction.reply({ embeds: [embed], ephemeral: true })

    }
}

export default SimulateLeave