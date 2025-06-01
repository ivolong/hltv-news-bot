import debounce from "debounce";
import { Client } from "discord.js";
import { Item } from "rss-parser";
import { logger } from "../utils/logging.js";

export type HltvArticle = Item & {
  pubDate: Date;
  media: {
    $: {
      url: string;
    };
  };
};

type StatsType = {
  server: {
    channels: number;
    roles: number;
  };
  message: {
    errors: { [key: string]: number };
  };
};

const logStats = debounce((guid, stats) => {
  logger.info(`Article ${guid} sent to guilds`, { stats });
}, 10e3);

module.exports = (client: Client, article: HltvArticle) => {
  logger.info("New article received", article);

  const stats: StatsType = {
    server: {
      channels: 0,
      roles: 0,
    },
    message: {
      errors: {},
    },
  };

  let channel;
  let role;
  let message;
  client.guilds.cache.forEach((guild) => {
    channel = guild.channels.cache.find(
      (channel) => channel.name === "news-feed",
    );

    if (!channel || channel.type !== "GUILD_TEXT") return;
    stats.server.channels++;

    role = guild.roles.cache.find((role) => role.name === "hltv");

    message = {
      content: `${article.title} ${article.link}`,
      embeds: [
        {
          title: article.title,
          description: article.content,
          url: article.link,
          color: 0x3c6ea1,
          author: {
            name: "HLTV",
            icon_url:
              "https://www.hltv.org/img/static/favicon/apple-touch-icon.png",
            url: "https://www.hltv.org",
          },
          image: {
            url: article.media.$.url,
          },
          footer: {
            text: "HLTV.org - The home of competitive Counter-Strike",
            icon_url:
              "https://www.hltv.org/img/static/favicon/apple-touch-icon.png",
          },
          timestamp: article.isoDate,
        },
      ],
    };

    if (role) {
      message.content = message.content.concat(` <@&${role.id}>`);
      stats.server.roles++;
    }

    channel
      .send(message)
      .catch((error: Error) => {
        if (!(error.message in stats.message.errors)) {
          stats.message.errors[error.message] = 0;
        }
        stats.message.errors[error.message]++;
      })
      .finally(() => {
        logStats(article.guid, stats);
      });
  });
};
