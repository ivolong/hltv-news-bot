const { SlashCommandBuilder } = require('@discordjs/builders')

const path = require('path')

const commandUtils = require(path.join(__dirname, '..', 'utils', 'command.js'))

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Get HLTV News notifications in your server'),

  async execute (interaction) {
    const [help] = await commandUtils.getSlashCommandString(interaction.client.application.commands, ['help'])

    interaction.reply(`Click on my name (<@${process.env.DISCORD_CLIENT_ID}>), then '+ Add App' and follow the required steps. Check out ${help} for assistance.`)
  }
}
