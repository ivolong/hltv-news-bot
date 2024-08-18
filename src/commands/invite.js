const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Get HLTV News notifications in your server'),

  async execute (interaction) {
    interaction.reply(`Click on my name (<@${process.env.DISCORD_CLIENT_ID}>), then add to server. Check out \`/help\` for assistance.`)
  }
}
