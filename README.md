# HLTV News Bot

A Discord bot that checks https://hltv.org for new articles and posts them in your server with optional @ping notifications.

Add it to your server via [Discord.com](https://discord.com/oauth2/authorize?client_id=745404733857988740&permissions=2416134160&scope=applications.commands%20bot).

# Instructions
0) Please give the bot the requested permissions. The bot will create a channel called `#news-feed` and a role called `@hltv` that it can ping. If it fails, follow step 1-3.
1) Create a channel called `#news-feed`.
2) Check the bot can read and send messages in this channel.
3) (Optional) Create a role called `@hltv` that the bot can ping.
4) The bot will find the channel, post a message in it and ping `@hltv` every time theres a new article.

Server members can opt into notifications by typing `/notify` and opt out with `/mute`.
Get help with `/help`.

Note: the bot is open to missing occasional articles very rarely and there is a minor delay (<5 seconds) on checking for new articles to prevent spamming HLTV.

# Support

Additional support can be found in the [community Discord server](https://discord.gg/dE3NFqTzEx).

# Issues & Contributions

Feel free to report an issue or open a pull request on this repository.
