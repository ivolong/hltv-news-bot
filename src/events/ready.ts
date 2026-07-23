import { Client } from "discord.js";

import { setCommands, updateActivity } from "../utils/bot.js";
import { logger } from "../utils/logging.js";
import { rssChecker } from "../utils/rss.js";

function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export default async function ready(client: Client) {
  logger.info("Online");

  setCommands(client);

  setInterval(updateActivity, 60e3, client);

  for (;;) {
    rssChecker("hltv", "https://www.hltv.org/rss/news", client);
    await sleep(5e3);
  }
}
