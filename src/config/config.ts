import 'dotenv/config';

import { Snowflake } from 'discord.js';

import { FatalError } from '../utils/errors.js';

// for easier reading
/* eslint-disable max-len */
/**
 * @property {boolean}   debug      - Whether debug mode is enabled
 * @property {boolean}   verbose    - Whether verbose output is enabled
 * @property {Snowflake} clientId   - The id of the bot to which application commands are registered, in the form of a Discord Snowflake
 * @property {string}    token      - The token of the bot
 */
interface Config {
    debug: boolean;
    verbose: boolean;
    clientId: Snowflake;
    token: string;
}

if (typeof process.env.TOKEN !== 'string') {
    throw new FatalError('Value was not provided for environmental variable TOKEN');
}

const config: Config = {
    debug: false,
    verbose: false,
    clientId: '1003943782913417267',
    token: process.env.TOKEN,
};

const development = {
};

const production = {
};

if (process.env.NODE_ENV === 'development') {
    Object.assign(config, development);
} else if (process.env.NODE_ENV === 'production') {
    Object.assign(config, production);
} else {
    throw new FatalError('Invalid value for environmental variable NODE_ENV: Must be either \'development\' or \'production\'');
}

export default config;
