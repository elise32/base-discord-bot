import { EmbedAssertions } from "discord.js"

/**
 * Handler to aggregate functions relating to accessing threads and information about them relevant to verification tickets in TransPlace
 */
class VerifyTicketHandler {
    // fields
    ticketsChannelId = '987230161764225044' // Elise Test Server test channel // FIXME: make this TransPlace tickets channel
    ticketsChannel

    /**
     * Constructor for VerifyTicketHandler. ticketsChannelId is optional and should have a default set. client is not.
     * 
     * @param {Client} client The Discord client
     * @param {Snowflake} ticketsChannelId The ID of the channel that contains all of the tickets to do operations on
     */
    constructor(client, ticketsChannelId) {
        this.client = client
        if (ticketsChannelId) {
            this.ticketsChannelId = ticketsChannelId
        }
        this.ticketsChannel = this.client.channels.cache.get(this.ticketsChannelId)

        if (!this.ticketsChannel) {
            throw `Tickets channel not found for the given ID ${this.ticketsChannelId}`
        }
        if (this.ticketsChannel.isThread()) {
            throw 'ID for ticket channel cannot be the ID of a thread!'
        }
    }


    /**
     * Retrieves all archived threads within the tickets channel and loads all of the archived channels into the cache in the process.
     * 
     * @returns All archived threads within the ticket channel
     */
    async getArchivedThreads() {
        return await this.ticketsChannel.threads.fetchArchived() // brings uncached threads into the cache. n.b. this returns all archived threads as well
    }

    /**
     * Gets all threads belonging to this channel.
     * 
     * @returns All threads in the given BaseChannel
     */
    async getAllThreads() {
        await this.getArchivedThreads()
        return this.ticketsChannel.threads.cache // TODO: determine if this correctly fetches all the threads
    }

    /**
     * Finds all threads that have the user's id as a space-delineated substring in the title. Useful because it is possible for users to create multiple tickets.
     * 
     * @param {Snowflake} userId The ID of the user who the tickets belong to
     * @returns All threads that are tickets belonging to the given user
     */
    async findAllUserTicketThreads(userId) {
        const allThreads = await this.getAllThreads()
        return allThreads.filter(thread => thread.name.split(' ').includes(userId))
    }

    /**
     * Finds the most recent thread in the given collection of threads by searching for the one with the highest timestamp
     * 
     * @param {Collection} threads The threads to search
     * @returns The thread with the highest timestamp
     */
    findMostRecentThread(threads) {
        const mostRecentTimestamp = Math.max(...threads.map((thread) => {
            return thread.createdTimestamp
        }))
        const mostRecentThread = threads.find((thread) => {
            return thread.createdTimestamp == mostRecentTimestamp
        })

        return mostRecentThread
    }

    /**
     * Checks if the given channel is a verification ticket thread. The conditions evaluated are if the channel is a thread and the thread's parent is the tickets channel.
     * @param {BaseChannel} channel The channel to check
     * @returns True if the given channel is a verification ticket thread, false if it is not
     */
    isVerificationTicket(channel) {
        return channel.isThread() && channel.parent === this.ticketsChannel
    }
}

export default VerifyTicketHandler