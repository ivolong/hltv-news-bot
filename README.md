# HLTV News Bot
A Discord bot that checks https://hltv.org for new articles and posts them in your server with optional @ping notifications.

https://top.gg/bot/745404733857988740

# Instructions
0) Please give the bot the requested permissions. The bot will create a channel called `#news-feed` and a role called `@hltv` that it can ping. If it fails, follow step 1-3.
1) Create a channel called `#news-feed`.
2) Check the bot can read and send messages in this channel.
3) (Optional) create a role called `@hltv` that the bot can ping.
4) The bot will find the channel, post a message in it and ping `@hltv` every time theres a new article.

Server members can opt into notifications by typing `!hltv` and opt out with `remove!hltv`.
Get help with `!hltv-help`.

Note: the bot is open to missing occasional articles very rarely and there is a minor delay (<5 seconds) on checking for new articles to prevent spamming hltv.
