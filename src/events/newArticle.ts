import { Client } from 'discord.js'
import { Item } from 'rss-parser'

module.exports = (client: Client, article: Item) => {
  console.log(`Received articleUpdate='${JSON.stringify(article)}'`)

  let channel
  let role
  let embed
  client.guilds.cache.forEach(guild => {
    channel = guild.channels.cache.find(channel => channel.name === 'news-feed')

    if (!channel || channel.type !== 'GUILD_TEXT') return

    role = guild.roles.cache.find(role => role.name === 'hltv')

    embed = {
      content: `${article.title} ${article.link}`,
      embeds: [{
        title: article.title,
        description: article.content,
        url: article.link,
        color: 0x3c6ea1,
        footer: {
          text: article.pubDate
        }
      }]
    }

    if (role) embed.content = embed.content.concat(` <@&${role.id}>`)

    channel.send(embed).catch(() => {})
  })
}
