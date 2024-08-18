const path = require('path')

const botUtils = require(path.join(__dirname, '..', 'utils', 'bot.js'))

module.exports = (client) => {
  console.log('Online')

  botUtils.setCommands(client)

  setInterval(botUtils.rssChecker, 3e3, 'hltv', 'https://www.hltv.org/rss/news', client)

  setInterval(botUtils.updateActivity, 60e3, client)
}
