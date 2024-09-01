module.exports = {
  getSlashCommandString (commands, commandNames) {
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
