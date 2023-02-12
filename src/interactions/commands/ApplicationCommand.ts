import {
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
    Snowflake,
} from 'discord.js';

import Bot from '../../Bot.js';
import Interaction from '../Interaction.js';

abstract class ApplicationCommand extends Interaction<
    | RESTPostAPIChatInputApplicationCommandsJSONBody
    | RESTPostAPIContextMenuApplicationCommandsJSONBody
> {
    guild?: Snowflake;

    constructor(client: Bot, name: string, guild?: Snowflake) {
        super(client, name);

        if (guild) {
            this.guild = guild;
        }
    }
}

export default ApplicationCommand;
