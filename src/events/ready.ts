import { Client } from 'discord.js'

const botUtils = require('../utils/bot.js')

module.exports = (client: Client) => {
  console.log('Online')

  botUtils.setCommands(client)

  setInterval(botUtils.rssChecker, process.env.RSS_CHECK_INTERVAL, 'hltv', 'https://www.hltv.org/rss/news', client)

  setInterval(botUtils.updateActivity, process.env.DISCORD_UPDATE_ACTIVITY_INTERVAL, client)
}
