import { GatewayIntentBits } from 'discord.js';
import yargs from 'yargs';

import Bot, { BotStartOptions } from './Bot.js';
import config from './config/config.js';
import { FatalError } from './utils/errors.js';

interface CLIArguments {
    d?: boolean
    v?: boolean
    r?: boolean
    c?: boolean
    g?: string
}

// parse arguments
const args: CLIArguments = yargs(process.argv.slice(2))
    .options({
        d: {
            alias: 'debug',
            describe: 'Enable debug mode',
            type: 'boolean',
        },
        v: {
            alias: 'verbose',
            describe: 'Enable verbose output',
            type: 'boolean',
        },
        r: {
            alias: 'register',
            describe: 'Registers application (slash and context menu) commands',
            type: 'boolean',
        },
        c: {
            alias: 'clean',
            describe: 'Unregisters application (slash and context menu) commands. Only unregisters global commands unless a value for -g was passed',
            type: 'boolean',
        },
        g: {
            alias: 'guild',
            describe: 'Specify a guild to clean guild-specific commands from',
            type: 'string',
        },
    })
    .parseSync();
const {
    d: debug,
    v: verbose,
    r: register,
    c: clean,
    g: guild,
} = args;

config.debug = Boolean(debug);
config.verbose = Boolean(verbose);

const options: BotStartOptions = {
    clean: Boolean(clean),
    registerCommands: Boolean(register),
    guildId: guild,
};

// create and start the bot
const bot = new Bot({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

try {
    await bot.start(config.token, options);
} catch (error) {
    /*
     * any error encountered during startup is considered fatal because they may place the bot in an
     * unexpected or unrecoverable state and they are immediately actionable
     */
    throw new FatalError('Encountered an error on client startup:', { cause: error });
}
