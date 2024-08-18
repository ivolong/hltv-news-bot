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

    client.guilds.cache.forEach(guild => {
      channel = guild.channels.cache.find(channel => channel.name == 'news-feed')

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
  }
}
