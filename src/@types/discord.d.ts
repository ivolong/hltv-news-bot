import { Collection } from "discord.js";

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, Command>;
  }

  export interface Command {
    name: string;
    description: string;
    execute: (command: CommandInteraction<CacheType>) => void;
  }
}
