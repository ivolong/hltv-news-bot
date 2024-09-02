import { Client } from 'discord.js'

const botUtils = require('../utils/bot.js')

module.exports = (client: Client) => {
  console.log('Online')

  botUtils.updateActivity(client)

  botUtils.setCommands(client)

  setInterval(botUtils.rssChecker, 5e3, 'hltv', 'https://www.hltv.org/rss/news', client)
}
