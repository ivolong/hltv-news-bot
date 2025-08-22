import { Client } from "discord.js";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import Parser, { Output } from "rss-parser";

import { HltvArticle } from "../events/newArticle.js";
import { logger } from "./logging";

const rss = new Parser({
  customFields: {
    item: ["pubDate", ["media:content", "media", { keepArray: false }]],
  },
  timeout: 5000,
});

export function rssChecker(name: string, url: string, client: Client) {
  const articleStorageFileLocation = join(
    __dirname,
    "..",
    "..",
    "storage",
    `current_${name}_article.json`,
  );

  (async () => {
    await rss.parseURL(url, function (error: Error, feed: Output<HltvArticle>) {
      if (error) {
        logger.error(`Error processing RSS feed ${url}`, error);
        return;
      }

      const newestArticle = feed.items[0];

      const file = readFileSync(articleStorageFileLocation);
      const currentArticle = JSON.parse(file.toString());

      const currentArticleDate = new Date(currentArticle.pubDate);
      const newestArticleDate = new Date(newestArticle.pubDate);
      const isStale = newestArticleDate < currentArticleDate;

      if (
        currentArticle.guid &&
        newestArticle.guid !== currentArticle.guid &&
        !isStale
      ) {
        const data = JSON.stringify(newestArticle);
        writeFileSync(articleStorageFileLocation, data);
        client.emit("newArticle", newestArticle);
      }
    });
  })();
}
