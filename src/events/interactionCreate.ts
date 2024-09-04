import { Client, Interaction } from 'discord.js'
import { logger } from '../utils/logging.js'

module.exports = async (client: Client, interaction: Interaction) => {
  if (!interaction.isCommand()) return

  const command = client.commands.get(interaction.commandName)

  if (!command) return

  logger.info('interactionCreate', interaction)

  try {
    await command.execute(interaction)
  } catch (error) {
    if (error) console.error(error)

    await interaction.reply({
      content: 'Sorry, an error occurred. Please try again later.',
      ephemeral: true
    })
  }
}
