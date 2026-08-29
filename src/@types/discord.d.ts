import { CacheType, ChatInputCommandInteraction, Collection } from "discord.js";

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, Command>;
  }

  export interface Command {
    name: string;
    description: string;
    ephemeral?: boolean;
    execute: (command: ChatInputCommandInteraction<CacheType>) => void;
  }
}
