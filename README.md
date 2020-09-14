# hltv-news-bot
A Discord bot that checks https://hltv.org for new articles

https://discord.com/oauth2/authorize?client_id=745404733857988740&permissions=134144&scope=bot

# instructions
1) create a channel called #news-feed
2) check the bot can read and send messages in this channel
3) (optional) create a role called @hltv that the bot can ping
4) the bot will find the channel, post a message in it and ping @hltv if the role exists every time theres a new article

note: the bot is open to missing occasional articles rarely and there is a minor delay (<5 seconds) on checking for new articles to prevent spamming hltv
