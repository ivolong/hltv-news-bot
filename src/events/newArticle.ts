import { Client } from "discord.js";
import { Item } from "rss-parser";

import { logger } from "../utils/logging.js";
import { deliverContentToAll } from "../utils/messaging.js";

export type HltvArticle = Item & {
  pubDate: Date;
  media: {
    $: {
      url: string;
    };
  };
};

export default function newArticle(client: Client, article: HltvArticle) {
  logger.info("New article received", article);

  const message = {
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

  deliverContentToAll(
    client,
    article.title ?? "[HLTV News Story]",
    message,
    article.guid,
  );
}
