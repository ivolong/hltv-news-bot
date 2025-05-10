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

module.exports = (client: Client, article: HltvArticle) => {
  logger.info("newArticle", article);

  let channel;
  let role;
  let message;
  client.guilds.cache.forEach((guild) => {
    channel = guild.channels.cache.find(
      (channel) => channel.name === "news-feed",
    );

    if (!channel || channel.type !== "GUILD_TEXT") return;

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

    if (role) message.content = message.content.concat(` <@&${role.id}>`);

    channel.send(message).catch(() => {});
  });
};
