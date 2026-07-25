import { Client } from "discord.js";

import { setCommands, updateActivity } from "../utils/bot";
import { logger } from "../utils/logging";
import { rssChecker } from "../utils/rss";
import {
  updateBotlistMeStats,
  updateDiscordBotsGgStats,
  updateDiscordListStats,
  updateTopGgStats,
} from "../utils/third-parties";

function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export default async function clientReady(client: Client) {
  logger.info("Online");

  setCommands(client);

  setInterval(() => {
    updateActivity(client);

    updateTopGgStats(client.guilds.cache.size);
    updateDiscordBotsGgStats(client.guilds.cache.size);
    updateBotlistMeStats(client.guilds.cache.size);
    updateDiscordListStats(client.guilds.cache.size);
  }, 120e3);

  for (;;) {
    try {
      await rssChecker(
        "hltv",
        `${process.env.HLTV_ENDPOINT ?? "https://www.hltv.org"}/rss/news`,
        client,
      );
    } catch (error) {
      logger.error(logger.error(`Error processing RSS feed:`, error));
    }

    await sleep(5e3);
  }
}
