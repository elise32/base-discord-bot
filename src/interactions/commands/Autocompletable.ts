import { AutocompleteInteraction } from 'discord.js';

import SlashCommand from './SlashCommand.js';

abstract class Autocompletable extends SlashCommand {
    abstract autocomplete(interaction: AutocompleteInteraction): Promise<void>
}

export default Autocompletable;
