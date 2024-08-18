const fs = require('fs')
const rss_parser = require('rss-parser')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { Client, Intents, Collection } = require('discord.js')

const botUtils = require('./utils/bot.js')

const rss = new rss_parser({
  timeout: 5000
})

const client = new Client({
  restRequestTimeout: 60000,
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
})

const commands = []
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

client.commands = new Collection()

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  commands.push(command.data.toJSON())
  client.commands.set(command.data.name, command)
}

if (process.env.DECLARE_SLASH_COMMANDS == 1) {
  console.log(`Declaring slash commands=${commands.size()}`)

  const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_REST_CLIENT_TOKEN);

  (async () => {
    try {
      await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        { body: commands }
      )
    } catch (error) {
      console.error(error)
    }
  })()
}

client.on('ready', () => {
  setInterval(rssChecker, 5000, 'hltv', 'https://www.hltv.org/rss/news')

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

function rssChecker (name, url) {
  const articleStorageFileLocation = `./storage/current_${name}_article.json`;

  (async () => {
    await rss.parseURL(url, function (error, feed) {
      if (error) return console.error(error)

      const newest_article = feed.items[0]

      file = fs.readFileSync(articleStorageFileLocation)
      const current_article = JSON.parse(file)

      if (current_article.guid && newest_article.guid != current_article.guid) {
        client.emit('newArticle', newest_article)
      }

      const data = JSON.stringify(newest_article)
      fs.writeFileSync(articleStorageFileLocation, data)
    })
  })()
}

client.login(process.env.DISCORD_CLIENT_TOKEN)
