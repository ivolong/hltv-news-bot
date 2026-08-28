import { Client } from "discord.js";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import Parser from "rss-parser";

import { EventNewArticle } from "../events/newArticle";

const rss = new Parser({
  customFields: {
    item: ["pubDate", ["media:content", "media", { keepArray: false }]],
  },
  timeout: 4e3,
});

export async function rssChecker(name: string, url: string, client: Client) {
  const articleStorageFileLocation = join(
    __dirname,
    "..",
    "..",
    "storage",
    `current_${name}_article.json`,
  );

  const feed = await rss.parseURL(url);
  const newestArticle = feed.items[0];

  const file = readFileSync(articleStorageFileLocation);
  const currentArticle = JSON.parse(file.toString());

  const currentArticleDate = new Date(currentArticle.pubDate);
  const newestArticleDate = new Date(newestArticle?.pubDate);
  const isStale = newestArticleDate < currentArticleDate;

  if (
    currentArticle.guid &&
    newestArticle?.guid !== currentArticle.guid &&
    !isStale
  ) {
    const data = JSON.stringify(newestArticle);
    writeFileSync(articleStorageFileLocation, data);
    client.emit(EventNewArticle, newestArticle);
  }
}
