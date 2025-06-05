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
    count: number;
    members: number;
    withChannel: {
      count: number;
      members: number;
      withRole: {
        count: number;
        members: number;
      };
    };
  };
  message: {
    errors: { [key: string]: number };
    members: number;
    roles: number;
  };
};

const logStats = debounce((guid, stats) => {
  logger.info(`Article ${guid} sent to guilds`, { stats });
}, 10e3);

module.exports = (client: Client, article: HltvArticle) => {
  logger.info("New article received", article);

  const stats: StatsType = {
    server: {
      count: 0,
      members: 0,
      withChannel: {
        count: 0,
        members: 0,
        withRole: {
          count: 0,
          members: 0,
        },
      },
    },
    message: {
      errors: {},
      members: 0,
      roles: 0,
    },
  };

  let channel;
  let role;
  let message;
  client.guilds.cache.forEach((guild) => {
    stats.server.count += guild.memberCount;
    stats.server.members += guild.memberCount;

    channel = guild.channels.cache.find(
      (channel) => channel.name === "news-feed",
    );

    if (!channel || channel.type !== "GUILD_TEXT") return;

    stats.server.withChannel.count++;
    stats.server.withChannel.members += guild.memberCount;

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
      stats.server.withChannel.withRole.count++;
      stats.server.withChannel.withRole.members += guild.memberCount;
    }

    let errored;
    channel
      .send(message)
      .catch((error: Error) => {
        errored = true;

        if (!(error.message in stats.message.errors)) {
          stats.message.errors[error.message] = 0;
        }
        stats.message.errors[error.message]++;
      })
      .finally(() => {
        logStats(article.guid, stats);
      });

    if (!errored) {
      stats.message.members += guild.memberCount;

      if (role) stats.message.roles++;
    }
  });
};
