const fs = require('fs')
const RssParser = require('rss-parser')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { Collection } = require('discord.js')

const rss = new RssParser({
  timeout: 5000
})

module.exports = {
  updateActivity: function (client) {
    const serverCount = client.guilds.cache.size
    const memberCount = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)

    const userActivityString = `/help | ${serverCount.toLocaleString('en')} servers & ${memberCount.toLocaleString('en')} members`

    console.log(`Updating userActivity='${userActivityString}'`)

    client.user.setActivity(userActivityString, { type: 'PLAYING' })
  },

  postUpdate: function (client, content, title, description) {
    console.log(`Posting update to servers: content='${content}' title='${title}' description='${description}'`)

    let channel
    let embed
    client.guilds.cache.forEach(guild => {
      channel = guild.channels.cache.find(channel => channel.name === 'news-feed')

      if (channel) {
        embed = {
          content,
          embeds: [{
            title,
            description
          }]
        }

        channel.send(embed).catch(() => {})
      }
    })
  },

  setCommands: function (client) {
    const commands = []
    const commandFiles = fs.readdirSync(`${__dirname}/../commands/`).filter(file => file.endsWith('.js'))

    client.commands = new Collection()

    for (const file of commandFiles) {
      const command = require(`${__dirname}/../commands/${file}`)
      commands.push(command.data.toJSON())
      client.commands.set(command.data.name, command)
    }

    if (process.env.DECLARE_SLASH_COMMANDS === 1) this.declareSlashCommands(commands)
  },

  declareSlashCommands: function (commands) {
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
  },

  rssChecker: function (name, url, client) {
    const articleStorageFileLocation = `${__dirname}/../storage/current_${name}_article.json`;

    (async () => {
      await rss.parseURL(url, function (error, feed) {
        if (error) return console.error(error)

        const newestArticle = feed.items[0]

        const file = fs.readFileSync(articleStorageFileLocation)
        const currentArticle = JSON.parse(file)

        if (currentArticle.guid && newestArticle.guid !== currentArticle.guid) {
          client.emit('newArticle', newestArticle)
        }

        const data = JSON.stringify(newestArticle)
        fs.writeFileSync(articleStorageFileLocation, data)
      })
    })()
  }
}
