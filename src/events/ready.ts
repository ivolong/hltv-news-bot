import { Client } from "discord.js";

import { setCommands, updateActivity } from "../utils/bot.js";
import { logger } from "../utils/logging.js";
import { rssChecker } from "../utils/rss.js";

export default function ready(client: Client) {
  logger.info("Online");

  setCommands(client);

  setInterval(updateActivity, 60e3, client);

  setInterval(rssChecker, 5e3, "hltv", "https://www.hltv.org/rss/news", client);
}
