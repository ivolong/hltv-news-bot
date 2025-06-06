import { ApplicationCommand, Collection, Snowflake } from "discord.js";

export function getSlashCommandString(
  commandNames: string[],
  commands?: Collection<Snowflake, ApplicationCommand>,
) {
  const commandNameStrings = [];

  for (const commandName of commandNames) {
    const command = commands?.find((command) => command.name === commandName);

    if (command) {
      commandNameStrings.push(`</${command.name}:${command.id}>`);
    } else {
      commandNameStrings.push(`\`/${commandName}\``);
    }
  }

  return commandNameStrings;
}
