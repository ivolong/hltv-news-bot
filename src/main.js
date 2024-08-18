const fs = require('fs')
const { Client, Intents } = require('discord.js')
const { AutoPoster } = require('topgg-autoposter')

const botUtils = require('./utils/bot.js')

const client = new Client({
  restRequestTimeout: 60000,
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
})

botUtils.setCommands(client)

AutoPoster(process.env.TOPGG_CLIENT_TOKEN, client).on('posted', () => {
  console.log('Statistics posted to Top.gg')
})

client.on('ready', () => {
  setInterval(botUtils.rssChecker, 5000, 'hltv', 'https://www.hltv.org/rss/news', client)

  setInterval(botUtils.updateActivity, 600e3, client)

  // botUtils.postUpdate(client, content, title, description)

  console.log('Start up successful')
})

fs.readdir('./events/', (error, files) => {
  if (error) return console.error(error)

  files.forEach(file => {
    const event = require(`./events/${file}`)
    const eventName = file.split('.')[0]
    client.on(eventName, event.bind(null, client))
  })
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return

  const command = client.commands.get(interaction.commandName)

  if (!command) return

  console.log(`Interaction name='${interaction.commandName}' created`)

  try {
    await command.execute(interaction)
  } catch (error) {
    if (error) console.error(error)

    await interaction.reply({
      content: 'Error executing command',
      ephemeral: true
    })
  }
})

client.login(process.env.DISCORD_CLIENT_TOKEN)
