import { Client } from "discord.js";
import { ButtonStyle } from "discord-api-types/v9";
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
          text: "HLTV.org",
          icon_url:
            "https://www.hltv.org/img/static/favicon/apple-touch-icon.png",
        },
        timestamp: article.isoDate,
      },
    ],
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: ButtonStyle.Link,
            label: "Read",
            url: article.link,
          },
        ],
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
