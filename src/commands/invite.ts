import { CommandInteraction } from "discord.js"

const { SlashCommandBuilder } = require('@discordjs/builders')

const commandUtils = require('../utils/command.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Get HLTV News notifications in your server'),

  async execute (interaction: CommandInteraction) {
    const [help] = commandUtils.getSlashCommandString(await interaction.client.application?.commands.fetch(), ['help'])

    interaction.reply(`Click on my name (<@${process.env.DISCORD_CLIENT_ID}>), then '+ Add App' and follow the required steps. Check out ${help} for assistance.`)
  }
}
