import { Client } from "discord.js";
import Parser, { Item } from "rss-parser";

import { EventNewArticle } from "../events/newArticle";
import { getLatestArticle, setLatestArticle } from "./cache";
import { logger } from "./logging";

export type HltvArticle = Omit<Item, "pubDate"> & {
  pubDate: Date;
  media?: {
    $: {
      url: string;
    };
  };
};

const rss = () =>
  new Parser({
    customFields: {
      item: ["pubDate", ["media:content", "media", { keepArray: false }]],
    },
    timeout: 4e3,
  });

export function parseItem(item?: unknown): HltvArticle | undefined {
  if (!item) return;
  if (typeof item !== "object") return;

  if (!("pubDate" in item) || typeof item.pubDate !== "string") return;
  if (!("guid" in item) || typeof item.guid !== "string") return;

  if (isNaN(new Date(item.pubDate).getTime())) return;
  if (item.guid.length < 1) return;

  return {
    ...item,
    guid: item.guid,
    pubDate: new Date(item.pubDate),
  };
}

export function isNewArticle(
  currentArticle: HltvArticle,
  newArticle: HltvArticle,
) {
  const isStale = newArticle.pubDate < currentArticle.pubDate;

  return newArticle.guid !== currentArticle.guid && !isStale;
}

export async function rssChecker(url: string, client: Client) {
  const feed = await rss().parseURL(url);
  const newestArticle = parseItem(feed.items[0]);
  if (!newestArticle) {
    logger.warn("Got unexpected article", { raw: feed.items[0] });
    return;
  }

  const currentArticle = getLatestArticle();
  if (!currentArticle) {
    setLatestArticle(newestArticle);
    return;
  }

  if (!isNewArticle(currentArticle, newestArticle)) return;

  setLatestArticle(newestArticle);
  client.emit(EventNewArticle, newestArticle);
}
