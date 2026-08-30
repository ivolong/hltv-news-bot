import { Client } from "discord.js";
import Parser from "rss-parser";

import { EventNewArticle, HltvArticle } from "../events/newArticle";
import { getLatestArticle, setLatestArticle } from "./cache";
import { logger } from "./logging";

const rss = new Parser({
  customFields: {
    item: ["pubDate", ["media:content", "media", { keepArray: false }]],
  },
  timeout: 4e3,
});

function parseItem(item?: HltvArticle) {
  if (!item) return;

  const parsedItem = item;

  if (!item.pubDate || !new Date(item.pubDate)) return;
  if (!item.guid || item.guid.length < 1) return;

  return parsedItem;
}

function isNewArticle(currentArticle: HltvArticle, newArticle: HltvArticle) {
  const currentArticleDate = new Date(currentArticle.pubDate);
  const newestArticleDate = new Date(newArticle.pubDate);
  const isStale = newestArticleDate < currentArticleDate;

  return (
    currentArticle.guid && newArticle?.guid !== currentArticle.guid && !isStale
  );
}

export async function rssChecker(url: string, client: Client) {
  const feed = await rss.parseURL(url);
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
