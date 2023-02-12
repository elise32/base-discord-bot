import { Events } from 'discord.js';

import Bot from '../Bot.js';
import Event from '../Event.js';

/**
 * Handler for error event. Experimental.
 */
class Error extends Event {
    /**
     * @param client The Discord client that will handle the event
     * @param name The name of the event
     */
    constructor(client: Bot, name: Events = Events.Error) {
        super(client, name);
    }

    /**
     * @param error The error that was encountered
     */
    // eslint-disable-next-line @typescript-eslint/require-await
    override async run(error: Error) {
        console.log('In error handler:');
        console.error(error);
    }
}

export default Error;
