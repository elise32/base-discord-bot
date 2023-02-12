import { APIButtonComponent, ButtonBuilder, JSONEncodable } from 'discord.js';

import Interaction from '../Interaction.js';
import TakesArguments from '../TakesArguments.js';

/**
 * Parent class for button interaction handlers.
 */
abstract class Button extends TakesArguments {
    abstract override getData(): ButtonBuilder;
}

export default Button;
