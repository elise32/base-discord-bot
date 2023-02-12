import { ContextMenuCommandBuilder } from 'discord.js';

import ApplicationCommand from './ApplicationCommand.js';

/**
 * Parent class for context menu command interaction handlers.
 */
abstract class ContextMenuCommand extends ApplicationCommand {
    abstract override getData(): ContextMenuCommandBuilder;
}

export default ContextMenuCommand;
