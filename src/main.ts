const fs = require('fs')
const path = require('path')
const { Client, Intents } = require('discord.js')
const { AutoPoster } = require('topgg-autoposter')

const client = new Client({
  restRequestTimeout: 60000,
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
})

AutoPoster(process.env.TOPGG_CLIENT_TOKEN, client).on('posted', () => {
  console.log('Statistics posted to Top.gg')
})

fs.readdir(path.join(__dirname, 'events'), (error: Error, files: string[]) => {
  if (error) return console.error(error)

  files.forEach(file => {
    const event = require(path.join(__dirname, 'events', file))
    const eventName: string = file.split('.')[0]
    client.on(eventName, event.bind(null, client))
  })
})

client.login(process.env.DISCORD_CLIENT_TOKEN)
