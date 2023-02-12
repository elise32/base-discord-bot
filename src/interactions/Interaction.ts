import {
    APIButtonComponent,
    APIModalInteractionResponseCallbackData,
    APISelectMenuComponent,
    BaseInteraction,
    ButtonBuilder,
    Client,
    ContextMenuCommandBuilder,
    DMChannel,
    JSONEncodable,
    ModalBuilder,
    NewsChannel,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    RESTPostAPIContextMenuApplicationCommandsJSONBody,
    SlashCommandBuilder,
    TextChannel,
    ThreadChannel,
    VoiceChannel,
} from 'discord.js';

import Handler from '../Handler.js';
import { AnySelectMenuBuilder } from './message_components/SelectMenu';

export enum InteractionType {
    SlashCommand,
    ContextMenuCommand,
    Button,
    SelectMenu,
    Modal,
}

interface MappedBuilder {
    [InteractionType.SlashCommand]: SlashCommandBuilder;
    [InteractionType.ContextMenuCommand]: ContextMenuCommandBuilder;
    [InteractionType.Button]: ButtonBuilder;
    [InteractionType.SelectMenu]: AnySelectMenuBuilder;
    [InteractionType.Modal]: ModalBuilder;
}

interface MappedJSONEncoding {
    [InteractionType.SlashCommand]: RESTPostAPIChatInputApplicationCommandsJSONBody;
    [InteractionType.ContextMenuCommand]: RESTPostAPIContextMenuApplicationCommandsJSONBody;
    [InteractionType.Button]: APIButtonComponent;
    [InteractionType.SelectMenu]: APISelectMenuComponent;
    [InteractionType.Modal]: APIModalInteractionResponseCallbackData;
}

/**
 * Parent class all interaction handlers. All subclasses should pass a name that is unique within
 * the class of subclass and implement run() and getData()
 */
abstract class Interaction<T extends InteractionType = InteractionType>
    extends Handler
    implements JSONEncodable<MappedJSONEncoding[T]> {
    /**
     * Returns data that describe the format of the interaction in some way.
     */
    abstract getData(): MappedBuilder[T]

    /**
     * Serializes this component to an API-compatible JSON object. Useful so you can pass a
     * SelectMenu directly to ActionRowBuilder().addComponents()
     * @returns The data of this button in JSON
     */
    toJSON(): MappedJSONEncoding[T] {
        return this.getData().toJSON();
    }

    abstract override run(interaction: BaseInteraction, ...args: unknown[]): Promise<void>;

    public static async resolveChannel(
        interaction: BaseInteraction,
        client: Client,
    ): Promise<
        | DMChannel
        | NewsChannel
        | TextChannel
        | ThreadChannel
        | VoiceChannel
        | null
    > {
        if (!interaction.channelId) { // modal submit is not guaranteed to have an id
            return null;
        }

        const channel = interaction.channel
            ?? await client.channels.fetch(interaction.channelId);

        if (channel
            && (
                channel instanceof DMChannel
                || channel instanceof NewsChannel
                || channel instanceof TextChannel
                || channel instanceof ThreadChannel
                || channel instanceof VoiceChannel
            )) {
            return channel;
        }

        return null;
    }
}

export default Interaction;
