module.exports = (client, article) => {
    console.log(`Received articleUpdate='${JSON.stringify(article)}'`);

	client.guilds.cache.forEach(guild => {
		channel = guild.channels.cache.find(channel => channel.name == "news-feed");

		if(channel) {
            role = guild.roles.cache.find(role => role.name == "hltv");

			embed = {
				content: `${article.title} ${article.link}`,
				embeds: [{
					title: article.title,
					description: article.content,
					url: article.link,
					color: "#3c6ea1",
					footer: {
						text: article.pubDate
					}
				}]
			};

			if(role) {
				embed.content = embed.content.concat(` <@&${role.id}>`);
			}

			channel.send(embed).catch(() => {});
		}
	});
};
