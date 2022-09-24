import Event from '../classes/Event.js'

const ticketsChannelId = '987230161764225044'
/**
 * Handler for the guildMemberRemove event.
 */
class GuildMemberRemove extends Event {
    async run(guildMember) {
        console.log(`Left:`)
        console.log(`Username: '${guildMember.user.username}'`)
        console.log(`ID: ${guildMember.user.id}`)

        // action on user leave: if the user has no roles, check for thread within the verify channel then send a message and archive it
        // check if the user has roles
        if (guildMember.roles.cache.size === 1) { // all users have the @everyone role, so if the size is 1 they have no other roles and we can assume they are an unverified member
            // proceed, search for thread
            const ticketsChannel = this.client.channels.cache.get(ticketsChannelId)

            // find the most recent thread

            // send a message in the thread and archive it
        }
    }
}

export default GuildMemberRemove