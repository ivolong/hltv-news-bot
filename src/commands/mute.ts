import { CommandInteraction } from "discord.js"

const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Stop getting notified when HLTV publishes an article'),

  async execute (interaction: CommandInteraction) {
    if (!interaction.inCachedGuild()) return

    const pingRole = interaction.guild.roles.cache.find(role => role.name === 'hltv')

    if (!pingRole) return interaction.reply('Sorry, there is no `@hltv` role in this server.')

    await interaction.member?.roles.remove(pingRole)

    await interaction.reply("Done, role removed (you won't get pinged)").catch(() => {})
  }
}
