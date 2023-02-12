import { Client, Events } from 'discord.js';

import Bot from '../Bot.js';
import Event from '../Event.js';

/**
 * Handler for the ready event. Displays a log in message. A ready event is emitted after the bot is
 * finished loading and logging in
 */
class Ready extends Event {
    /**
     * @param client The Discord Client that will handle the event
     * @param name The name of the event
     */
    constructor(client: Bot, name: Events = Events.ClientReady) {
        super(client, name);
    }

    /**
     * @param client The client that became ready
     */
    // eslint-disable-next-line @typescript-eslint/require-await
    override async run(client: Client<true>) {
        console.log(`Logged in as ${client.user.tag}`);
    }
}

export default Ready;
