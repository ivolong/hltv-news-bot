module.exports = async (client, interaction) => {
  if (!interaction.isCommand()) return

  const command = client.commands.get(interaction.commandName)

  if (!command) return

  console.log(`Interaction name='${interaction.commandName}' created`)

  try {
    await command.execute(interaction)
  } catch (error) {
    if (error) console.error(error)

    await interaction.reply({
      content: 'Error executing command',
      ephemeral: true
    })
  }
}
