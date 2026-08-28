import { ButtonStyle, Client } from "discord.js";
import { Item } from "rss-parser";

import { inviteButton } from "../utils/components";
import { logger } from "../utils/logging";
import { deliverContentToAll } from "../utils/messaging";

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
        title: `${article.title}`,
        description: `${article.content}`,
        url: `${article.link}`,
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
        timestamp: `${article.isoDate}`,
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
          {
            type: 2,
            style: ButtonStyle.Link,
            label: "View comments",
            url: `${article.link}#comments`,
          },
          inviteButton(),
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

export const EventNewArticle = "newArticle";
