const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Stop getting notified when HLTV publishes an article'),

  async execute (interaction) {
    role_id = interaction.guild.roles.cache.find(role => role.name == 'hltv')

    await interaction.member.roles.remove(role_id).catch(() => {})
      .then(interaction.reply("Done, role removed (you won't get pinged)")).catch(() => {})
  }
}
