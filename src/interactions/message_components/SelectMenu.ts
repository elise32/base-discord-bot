import {
    AnySelectMenuInteraction,
    APISelectMenuComponent,
    BaseSelectMenuBuilder,
    ChannelSelectMenuBuilder,
    ChannelSelectMenuInteraction,
    MentionableSelectMenuBuilder,
    MentionableSelectMenuInteraction,
    Role,
    RoleSelectMenuBuilder,
    RoleSelectMenuInteraction,
    StringSelectMenuBuilder,
    StringSelectMenuInteraction,
    User,
    UserSelectMenuBuilder,
    UserSelectMenuInteraction,
} from 'discord.js';

import TakesArguments from '../TakesArguments.js';

export type Mentionable = User | Role;

export enum SelectMenuType {
    String,
    User,
    Role,
    Mentionable,
    Channel,
}

export type AnySelectMenuBuilder =
    | StringSelectMenuBuilder
    | UserSelectMenuBuilder
    | RoleSelectMenuBuilder
    | MentionableSelectMenuBuilder
    | ChannelSelectMenuBuilder

interface BuilderType {
    [SelectMenuType.String]: StringSelectMenuBuilder;
    [SelectMenuType.User]: UserSelectMenuBuilder;
    [SelectMenuType.Role]: RoleSelectMenuBuilder;
    [SelectMenuType.Mentionable]: MentionableSelectMenuBuilder;
    [SelectMenuType.Channel]: ChannelSelectMenuBuilder;
}

interface InteractionType {
    [SelectMenuType.String]: StringSelectMenuInteraction;
    [SelectMenuType.User]: UserSelectMenuInteraction;
    [SelectMenuType.Role]: RoleSelectMenuInteraction;
    [SelectMenuType.Mentionable]: MentionableSelectMenuInteraction;
    [SelectMenuType.Channel]: ChannelSelectMenuInteraction;
}

/**
 * Parent class for select menu interaction handlers.
 */
export default abstract class SelectMenu<T extends SelectMenuType = SelectMenuType> extends TakesArguments {
    abstract override getData(): BuilderType[T];

    abstract override run(interaction: InteractionType[T], ...args: unknown[]):
        Promise<void>;
}