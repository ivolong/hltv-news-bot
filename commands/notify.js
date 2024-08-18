const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('notify')
    .setDescription('Get notified when HLTV publishes an article'),

  async execute (interaction) {
    role_id = interaction.guild.roles.cache.find(role => role.name == 'hltv')

    await interaction.member.roles.add(role_id).catch(() => {})
      .then(interaction.reply("Done, role added (you'll get a @ping)")).catch(() => {})
  }
}
