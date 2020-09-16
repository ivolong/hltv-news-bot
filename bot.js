const discord = require("discord.js")
const client = new discord.Client()

const reactive_messages = {
	hltv: "hltv"
}

client.on("ready", () => {
	console.log("Ready")
	client.user.setActivity("hltv for " + client.guilds.cache.reduce((a, guild) => a + guild.memberCount, 0).toLocaleString("en") + " users/" + client.guilds.cache.size.toLocaleString("en") + " servers", { type: "WATCHING" })

	hltv_checker()
	cs_blog_checker()

	setInterval(hltv_checker, 5e3)
	setInterval(cs_blog_checker, 60e3)
})

client.on("guildCreate", (guild) => {
	guild.owner.send({
		embed: {
			title: "instructions",
			description: "hi thanks for adding me\n\nmake sure there is a channel called `#news-feed` and make sure **i can read and send messages in it** - i will post new articles in there\n\nif you want to be pinged with article notifications, **make sure there is a role called `@hltv` and make sure i can ping it**\n\njoin [here](https://discord.gg/2CRSS2V) and message <@243498117767495681> for help"
		}
	}).catch(() => {})

	guild.roles.create({
		data: {
			name: "hltv",
			color: "#3c6ea1",
		},
		reason: "pingable hltv role by hltv newsmen))",
	}).catch(() => {})

	guild.channels.create("news-feed", { "reason": "hltv news article updates channel by hltv newsmen))" })
		.then((channel) => {
			channel.send({
				embed: {
					title: "instructions",
					description: "hi thanks for adding me\n\ni'll post new articles from hltv in here\n\nif you want to be notified, type `!hltv` and i'll give you a pingable role **if it exists**. type `remove!hltv` to remove it\n\njoin [here](https://discord.gg/2CRSS2V) and message <@243498117767495681> for help"
				}
			}).catch(() => {})
		})
		.catch(() => {})
})

client.on("message", (message) => {
	if (message.channel.type == "text") {
		if (reactive_messages[message.content.replace("!", "")]) {
			role_id = message.guild.roles.cache.find(role => role.name == reactive_messages[message.content.replace("!", "")])
				
			message.member.roles.add(role_id).catch(() => {})
				.then(message.react(client.emojis.resolveIdentifier("751992994021769387")))
		} else if (reactive_messages[message.content.replace("remove!", "")]) {
			role_id = message.guild.roles.cache.find(role => role.name == reactive_messages[message.content.replace("remove!", "")])
				
			message.member.roles.remove(role_id).catch(() => {})
				.then(message.react(client.emojis.resolveIdentifier("751992994021769387")))

		}
	}
})

client.on("newArticle", (article) => {
	client.guilds.cache.forEach(guild => {
		channel = guild.channels.cache.find(channel => channel.name == "news-feed")
		role = guild.roles.cache.find(role => role.name == "hltv")

		if (channel) {
			embed = {
				content: article.title,
				embed: {
					title: article.title,
					description: article.content,
					url: article.link,
					color: "#3c6ea1",
					footer: {
						text: article.pubDate
					}
				}
			}

			if (role) {
				embed.content = embed.content + " <@&" + role.id + ">" 
			}

			channel.send(embed)
		}
	})
})

const rss_parser = require('rss-parser')
const rss = new rss_parser()
const fs = require('fs')

function hltv_checker (current_article) {
	(async () => {
		let feed = await rss.parseURL("https://www.hltv.org/rss/news")
		let newest_article = feed.items[0]

		file = fs.readFileSync("current_hltv_article.json")
		let current_article = JSON.parse(file)

		if (current_article.guid && newest_article.guid != current_article.guid) {
			client.emit("newArticle", newest_article)
		}

		let data = JSON.stringify(newest_article);
		fs.writeFileSync("current_hltv_article.json", data)
	})()
}

function cs_blog_checker (current_article) {
	(async () => {
		let feed = await rss.parseURL("https://blog.counter-strike.net/index.php/feed/")
		let newest_article = feed.items[0]

		file = fs.readFileSync("current_cs_article.json")
		let current_article = JSON.parse(file)

		if (current_article.guid && newest_article.guid != current_article.guid) {
			client.emit("newArticle", newest_article)
		}

		let data = JSON.stringify(newest_article);
		fs.writeFileSync("current_cs_article.json", data)
	})()
}

client.login(process.env.discord_api_token)
