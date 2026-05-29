import { Client, Interaction } from "discord.js";

import { logger } from "../utils/logging.js";

export default async function interactionCreate(
  client: Client,
  interaction: Interaction,
) {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  logger.info("Slash command used", interaction);

  try {
    await command.execute(interaction);
  } catch (error) {
    if (error) logger.error("Error executing slash command:", error);

    await interaction.reply({
      content: "Sorry, an error occurred. Please try again later.",
      ephemeral: true,
    });
  }
}
