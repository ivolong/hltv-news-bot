import { Client } from "discord.js";

import { setCommands, updateActivity } from "../utils/bot";
import { logger } from "../utils/logging";
import { rssChecker } from "../utils/rss";

function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export default async function clientReady(client: Client) {
  logger.info("Online");

  setCommands(client);

  setInterval(updateActivity, 60e3, client);

  for (;;) {
    try {
      await rssChecker("hltv", `${process.env.HLTV_ENDPOINT ?? "https://www.hltv.org"}/rss/news`, client);
    } catch (error) {
      logger.error(logger.error(`Error processing RSS feed:`, error));
    }

    await sleep(5e3);
  }
}
