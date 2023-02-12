import { APIModalInteractionResponseCallbackData, ModalBuilder } from 'discord.js';

import TakesArguments from './TakesArguments.js';

/**
 * Parent class for modal interaction handlers.
 */
export default abstract class Modal
    extends TakesArguments<APIModalInteractionResponseCallbackData> {
    abstract override getData(): ModalBuilder;
}
