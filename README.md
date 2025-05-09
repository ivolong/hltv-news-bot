# HLTV News Bot

[![Super-Linter](https://github.com/ivolong/hltv-news-bot/actions/workflows/super-linter.yml/badge.svg)](https://github.com/ivolong/hltv-news-bot/actions/workflows/super-linter.yml)

[![Discord Bots](https://top.gg/api/widget/status/745404733857988740.svg)](https://top.gg/bot/745404733857988740)
[![Discord Bots](https://top.gg/api/widget/servers/745404733857988740.svg)](https://top.gg/bot/745404733857988740)
[![Discord Bots](https://top.gg/api/widget/upvotes/745404733857988740.svg)](https://top.gg/bot/745404733857988740)

A Discord bot that checks [HLTV](https://hltv.org) for new articles and posts them in your server with optional @ping notifications.

## Instructions

[Add the bot to your Discord server](https://discord.com/oauth2/authorize?client_id=745404733857988740&permissions=2416134160&scope=applications.commands%20bot) and **give it the required permissions**. The bot will create a channel called <kbd>#news-feed</kbd> and a role called <kbd>@hltv</kbd> that it can ping. If it fails, follow steps 1-3:

1. Create a channel called <kbd>#news-feed</kbd>.
2. Give the bot permission to read and send messages in the <kbd>#news-feed</kbd> channel.
3. Create a role called <kbd>@hltv</kbd> that the bot can ping.

The bot will post messages in the <kbd>#news-feed</kbd> channel and ping the <kbd>@hltv</kbd> role every time theres a new article.

Note: the bot is open to missing occasional articles very rarely and there is a minor delay (<5 seconds) on checking for new articles to prevent spamming HLTV.

### Notifications

Server members can opt into notifications by typing <kbd>/notify</kbd> and opt out with <kbd>/mute</kbd>.

## Support

Ask the bot for help by typing <kbd>/help</kbd>.

Additional support can be found in the [community Discord server](https://discord.gg/dE3NFqTzEx).

## Issues & Contributions

Feel free to report an issue or open a pull request on this repository.
