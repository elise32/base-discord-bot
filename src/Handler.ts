import Bot from './Bot.js';

abstract class Handler {
    client: Bot;

    name: string;

    constructor(client: Bot, name: string) {
        this.client = client;
        this.name = name;
    }

    /**
     * Runs the handler in an implementation
     * @param args The arguments for the handler
     */
    abstract run(...args: unknown[]): Promise<void>
}

export default Handler;
