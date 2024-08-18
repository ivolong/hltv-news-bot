const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('notify')
    .setDescription('Get notified when HLTV publishes an article'),

  async execute (interaction) {
    const roleId = interaction.guild.roles.cache.find(role => role.name === 'hltv')

    await interaction.member.roles.add(roleId).catch(() => {})
      .then(interaction.reply("Done, role added (you'll get a @ping)")).catch(() => {})
  }
}
