import { Client, Interaction, MessageFlags } from "discord.js";

import { logger } from "../utils/logging";

export default async function interactionCreate(
  client: Client,
  interaction: Interaction,
) {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  await interaction.deferReply({
    flags: command.ephemeral ? MessageFlags.Ephemeral : undefined,
  });

  logger.info("Slash command used", { command: command.name });

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error("Error executing slash command", error);

    await interaction.editReply({
      content: "Sorry, an error occurred. Please try again later.",
    });
  }
}
