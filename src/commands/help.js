const { SlashCommandBuilder } = require('@discordjs/builders')

const path = require('path')

const commandUtils = require(path.join(__dirname, '..', 'utils', 'command.js'))

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get help on using this bot'),

  async execute (interaction) {
    const [notify, mute, invite] = await commandUtils.getSlashCommandString(interaction.client.application.commands, ['notify', 'mute', 'invite'])

    interaction.reply(`In order to work, this bot needs a channel called \`#news-feed\` to post articles in and (optionally) a role called \`@hltv\` to ping with notifications.\n\nWant notifications when there's a new article?\nType ${notify} and I'll give you a pingable role.\nType ${mute} to remove the role.\n\n${invite} to invite me to your server.\n\nJoin our server for further assistance: https://discord.gg/dE3NFqTzEx`)
  }
}
