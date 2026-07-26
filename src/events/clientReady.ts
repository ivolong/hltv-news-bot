import { Client } from "discord.js";

import { setCommands, updateActivity } from "../utils/bot";
import { logger } from "../utils/logging";
import { rssChecker } from "../utils/rss";
import { updateStats } from "../utils/stats";

function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export default async function clientReady(client: Client) {
  logger.info("Online");

  setCommands(client);

  setInterval(updateActivity, 60e3, client);

  setInterval(updateStats, 10 * 60 * 1000, client.guilds.cache.size);

  for (;;) {
    try {
      await rssChecker(
        "hltv",
        `${process.env.HLTV_ENDPOINT ?? "https://www.hltv.org"}/rss/news`,
        client,
      );
    } catch (error) {
      logger.warn("Error processing RSS feed", error);
    }

    await sleep(5e3);
  }
}
