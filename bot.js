const discord = require("discord.js")
const client = new discord.Client()

const DBL = require("dblapi.js")
const dbl = new DBL('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc0NTQwNDczMzg1Nzk4ODc0MCIsImJvdCI6dHJ1ZSwiaWF0IjoxNjExOTM0MjUxfQ.hWD8X5Xpc6eBVBGIi96bNTNW1bsIx-bHPb0oxnEH5zg', client)

dbl.on('posted', () => {
	console.log('Server count posted to Top.gg');
})

const reactive_messages = {
	hltv: "hltv"
}

client.on("ready", () => {
	client.user.setActivity("!hltv-help | " + client.guilds.cache.reduce((a, guild) => a + guild.memberCount, 0).toLocaleString("en") + " users/" + client.guilds.cache.size.toLocaleString("en") + " servers", { type: "WATCHING" })

	hltv_checker()
	cs_blog_checker()

	setInterval(hltv_checker, 3e3)
	setInterval(cs_blog_checker, 60e3)
})

client.on("guildCreate", (guild) => {
// 	guild.owner.send({
// 		embed: {
// 			title: "Instructions",
// 			description: "Hi thanks for adding me.\n\nMake sure there is a channel called `#news-feed` and make sure **I can read and send messages in it** - I will post new articles in there.\n\nIf you want to be pinged with article notifications, **make sure there is a role called `@hltv` and make sure I can ping it**.\n\nJoin [here](https://discord.gg/2CRSS2V) and message <@243498117767495681> for help."
// 		}
// 	}).catch(() => {})

	guild.roles.create({
		data: {
			name: "hltv",
			color: "#3c6ea1",
		},
		reason: "Pingable HLTV role by HLTV News bot.",
	}).catch(() => {})

	guild.channels.create("news-feed", { "reason": "HLTV news article updates channel by HLTV News bot." })
		.then((channel) => {
			channel.send({
				embed: {
					title: "Information",
					description: "Thanks for adding me.\n\nI'll post new articles from HLTV in here.\n\nDo you want notifications?\nType `!hltv` and I'll give you a pingable role **if it exists**.\nType `remove!hltv` to remove the role.\n\nType `!hltv-help` for general help.\n\nType `!hltv-invite` to invite me to your server.\n\nJoin [here](https://discord.gg/2CRSS2V) and message <@243498117767495681> for help."
				}
			}).catch(() => {})
		})
		.catch(() => {})
})

client.on("message", (message) => {
	if (message.content == "!hltv-help") {
		reply_with_help(message)

	} else if (message.content == "!hltv-invite") {
		reply_with_invite(message)
	}

	if (message.channel.type == "text") {
		if (reactive_messages[message.content.replace("!", "")]) {
			role_id = message.guild.roles.cache.find(role => role.name == reactive_messages[message.content.replace("!", "")])
				
			message.member.roles.add(role_id).catch(() => {})
				.then(message.react(client.emojis.resolveIdentifier("751992994021769387")).catch(() => {}))
			
		} else if (reactive_messages[message.content.replace("remove!", "")]) {
			role_id = message.guild.roles.cache.find(role => role.name == reactive_messages[message.content.replace("remove!", "")])
				
			message.member.roles.remove(role_id).catch(() => {})
				.then(message.react(client.emojis.resolveIdentifier("751992994021769387")).catch(() => {}))

		}
	}
})

client.on("newArticle", (article) => {
	client.guilds.cache.forEach(guild => {
		channel = guild.channels.cache.find(channel => channel.name == "news-feed")
		role = guild.roles.cache.find(role => role.name == "hltv")

		if (channel) {
			embed = {
				content: article.title + " " + article.link,
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

			channel.send(embed).catch(() => {})
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

function reply_with_help (message) {
	message.reply({
		embed: {
			title: "General Help",
			description: "In order to work, this bot needs a channel called `#news-feed` to post articles in and (optionally) a role called `@hltv` to ping with notifications.\n\nWant notifications when there's a new article?\nType `!hltv` and I'll give you a pingable role.\nType `remove!hltv` to remove the role.\n\n`!hltv-invite` to invite me to your server.\n\nJoin [here](https://discord.gg/2CRSS2V) and message <@243498117767495681> for help."
		}
	}).catch(() => {})
}

function reply_with_invite (message) {
	message.reply({
		embed: {
			title: "HLTV News",
			description: "Add me to your server via [Top.gg](https://top.gg/bot/745404733857988740) (the Discord bot list)."
		}
	}).catch(() => {})
}

client.login(process.env.discord_api_token)
