const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Get help on using this bot"),

    async execute(interaction) {
        interaction.reply("In order to work, this bot needs a channel called `#news-feed` to post articles in and (optionally) a role called `@hltv` to ping with notifications.\n\nWant notifications when there's a new article?\nType `/notify` and I'll give you a pingable role.\nType `/mute` to remove the role.\n\n`/invite` to invite me to your server.\n\nJoin [here](https://discord.gg/dE3NFqTzEx) for assistance.");
    }
};
