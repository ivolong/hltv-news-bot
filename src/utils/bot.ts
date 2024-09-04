import { SlashCommandBuilder } from '@discordjs/builders'
import { Client } from 'discord.js'
import { Item, Output } from 'rss-parser'

const fs = require('fs')
const path = require('path')
const RssParser = require('rss-parser')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { Collection } = require('discord.js')

const rss = new RssParser({
  timeout: 5000
})

module.exports = {
  updateActivity: function (client: Client) {
    const serverCount = client.guilds.cache.size

    const userActivityString = `/help | ${serverCount.toLocaleString('en')} servers`

    client.user?.setActivity(userActivityString, { type: 'WATCHING' })
  },

  postUpdate: function (client: Client, content: string, title: string, description: string) {
    console.log(`Posting update to servers: content='${content}' title='${title}' description='${description}'`)

    let channel
    let embed
    client.guilds.cache.forEach(guild => {
      channel = guild.channels.cache.find(channel => channel.name === 'news-feed')

      if (!channel || channel.type !== 'GUILD_TEXT') return

      embed = {
        content,
        embeds: [{
          title,
          description
        }]
      }

      channel.send(embed).catch(() => {})
    })
  },

  setCommands: function (client: Client) {
    console.log('Setting commands')

    const commands: SlashCommandBuilder[] = []
    const commandFiles: string[] = fs.readdirSync(path.join(__dirname, '..', 'commands'))

    client.commands = new Collection()

    for (const file of commandFiles) {
      const command = require(path.join(__dirname, '..', 'commands', file))
      commands.push(command.data.toJSON())
      client.commands.set(command.data.name, command)
    }

    if (process.env.DECLARE_SLASH_COMMANDS === '1') this.declareSlashCommands(commands)
  },

  declareSlashCommands: function (commands: SlashCommandBuilder[]) {
    console.log(`Declaring slash commands=${commands.length}`)

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

  rssChecker: function (name: string, url: string, client: Client) {
    const articleStorageFileLocation = path.join(__dirname, '..', '..', 'storage', `current_${name}_article.json`);

    (async () => {
      await rss.parseURL(url, function (error: Error, feed: Output<Item>) {
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
