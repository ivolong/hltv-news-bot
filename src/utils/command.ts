import { ApplicationCommand, Collection, Snowflake } from 'discord.js'

module.exports = {
  getSlashCommandString (commands: Collection<Snowflake, ApplicationCommand>, commandNames: string[]) {
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
