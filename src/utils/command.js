module.exports = {
  async getSlashCommandString (commands, commandNames) {
    commands = await commands.fetch()

    const commandNameStrings = []
    for (const commandName of commandNames) {
      const command = commands.find(command => command.name === commandName)

      if (command) {
        commandNameStrings.push(`</${command.name}:${command.id}>`)
      } else {
        commandNameStrings.push(`\`/${commandName}\``)
      }
    }

    return commandNameStrings
  }
}
