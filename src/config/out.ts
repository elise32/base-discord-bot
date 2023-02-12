import config from './config.js';

function debug(...args: unknown[]) {
    if (config.debug) {
        console.debug(...args);
    }
}

function verbose(...args: unknown[]) {
    if (config.verbose) {
        console.info(...args);
    }
}

export { debug, verbose };
