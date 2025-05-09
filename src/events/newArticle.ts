import { Client } from "discord.js";
import { Item } from "rss-parser";
import { logger } from "../utils/logging.js";

type HltvArticle = Item & {
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
          thumbnail: {
            url: article.media.$.url,
          },
          footer: {
            text: article.pubDate,
          },
        },
      ],
    };

    if (role) message.content = message.content.concat(` <@&${role.id}>`);

    channel.send(message).catch(() => {});
  });
};
