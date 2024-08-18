const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('support')
    .setDescription('Support the running of this bot'),

  async execute (interaction) {
    interaction.reply('Please consider supporting me on [Patreon](https://www.patreon.com/hltvnewsbot). Thank you!')
  }
}
