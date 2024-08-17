module.exports = (client, guild) => {
    console.log(`Added to new server='${guild}'`);

	guild.roles.create({
		name: "hltv",
		color: "#3c6ea1",
		reason: "Pingable HLTV role by HLTV News bot.",
	}).catch(() => {});

	guild.channels.create("news-feed", { "reason": "HLTV news article updates channel by HLTV News bot." })
		.then((channel) => {
			channel.send({
				embeds: [{
					title: "Information",
					description: "Thanks for adding me.\n\nI'll post new articles from HLTV in here.\n\nDo you want notifications?\nType `/notify` and I'll give you a pingable role **if it exists**.\nType `/mute` to remove the role.\n\nType `/help` for general help.\n\nType `/invite` to invite me to your server.\n\nJoin [here](https://discord.gg/dE3NFqTzEx) for assistance.\n\nPlease consider supporting me on [Patreon](https://www.patreon.com/hltvnewsbot). Thank you!"
				}]
			}).catch(() => {});
		})
		.catch(() => {});
};
