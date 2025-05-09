import { SlashCommandBuilder } from '@discordjs/builders'
import { Client } from 'discord.js'
import { Item, Output } from 'rss-parser'

const fs = require('fs')
const path = require('path')
const RssParser = require('rss-parser')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { Collection } = require('discord.js')

import { logger } from '../utils/logging.js'

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
    const message = {
      content,
      embeds: [{
        title,
        description
      }]
    }

    logger.info('Posting update to servers', message)

    let channel
    let embed
    client.guilds.cache.forEach(guild => {
      channel = guild.channels.cache.find(channel => channel.name === 'news-feed')

      if (!channel || channel.type !== 'GUILD_TEXT') return

      channel.send(message).catch(() => {})
    })
  },

  setCommands: function (client: Client) {
    logger.info('Setting commands')

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
    logger.info('Declaring slash commands', commands)

    const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_REST_CLIENT_TOKEN);

    (async () => {
      try {
        await rest.put(
          Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
          { body: commands }
        )
      } catch (error) {
        logger.error(error)
      }
    })()
  },

  rssChecker: function (name: string, url: string, client: Client) {
    const articleStorageFileLocation = path.join(__dirname, '..', '..', 'storage', `current_${name}_article.json`);

    (async () => {
      await rss.parseURL(url, function (error: Error, feed: Output<Item>) {
        if (error) {
          logger.error(error)
          return
        }

        const newestArticle = feed.items[0]

        let isStale = false
        const pubDate = new Date(newestArticle.pubDate!)
        if (isNaN(pubDate.getTime())) {
          logger.warn("Could not parse article publish date, cannot determine staleness", newestArticle)
        } else {
          const now = new Date()
          isStale = (now.getTime() - pubDate.getTime()) > (5 * 60 * 1000)
        }

        const file = fs.readFileSync(articleStorageFileLocation)
        const currentArticle = JSON.parse(file)

        if (currentArticle.guid && newestArticle.guid !== currentArticle.guid && !isStale) {
          client.emit('newArticle', newestArticle)
        }

        const data = JSON.stringify(newestArticle)
        fs.writeFileSync(articleStorageFileLocation, data)
      })
    })()
  }
}
