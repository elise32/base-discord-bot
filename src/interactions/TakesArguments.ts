/* eslint-disable max-classes-per-file */
import {
    AnyComponentBuilder,
    APIButtonComponent,
    APIModalInteractionResponseCallbackData,
    APISelectMenuComponent,
} from 'discord.js';

import Interaction from './Interaction.js';

export type TakesArgumentsJSONType =
    | APIButtonComponent
    | APISelectMenuComponent
    | APIModalInteractionResponseCallbackData

const delim = '|';

/**
 * A class that has a need to store arguments to be parsed later.
 */
export default abstract class TakesArguments<JSONEncoding extends TakesArgumentsJSONType>
    extends Interaction<JSONEncoding> {
    /**
     * Joins the arguments together with a delimiter
     * @param args The elements to join
     * @returns The arguments joined with the delimiter
     */
    static delimit(...args: unknown[]): string {
        return args.join(delim);
    }

    /**
     * Tokenizes a delimited string
     * @param string A delimited string
     * @returns An array containing each token
     */
    static tokenize(string: string): string[] {
        return string.split(delim);
    }

    /**
     * Adds arguments to a builder
     * @param builder The builder to add arguments to
     * @param args The arguments to add
     * @returns The builder with the arguments added
     */
    static addArgs<
        T extends AnyComponentBuilder & { data: { custom_id: string } }
    >(builder: T, ...args: unknown[]): T {
        return builder.setCustomId(TakesArguments.delimit(builder.data.custom_id, ...args)) as T;
    }

    abstract override getData(): AnyComponentBuilder;

    /**
     * Creates a version of this instance's data with arguments added in.
     * @param args Arguments to add on to the data
     * @returns The data with the arguments added in
     */
    addArgs(...args: unknown[]): AnyComponentBuilder {
        return TakesArguments.addArgs(this.getData(), ...args);
    }
}
