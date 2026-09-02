import { Client } from "discord.js";

import { setCommands, updateActivity } from "../utils/bot";
import { logger } from "../utils/logging";
import { rssChecker } from "../utils/rss";
import { updateStats } from "../utils/stats";

export const TIME_SECOND = 1000;

function sleep(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function getRemainingTimeForInterval(
  startTime: Date,
  minWaitIntervalMs: number,
  timeNow: Date = new Date(),
) {
  if (startTime > timeNow) {
    return 0;
  }

  const timeWaited = timeNow.getTime() - startTime.getTime();

  if (timeWaited >= minWaitIntervalMs) {
    return 0;
  }

  return minWaitIntervalMs - timeWaited;
}

export default async function clientReady(client: Client) {
  logger.info("Online");

  setCommands(client);

  setInterval(updateActivity, 60 * TIME_SECOND, client);

  setInterval(() => updateStats(client.guilds.cache.size), 600 * TIME_SECOND);

  let startTime;
  while (client.isReady()) {
    startTime = new Date();

    try {
      await rssChecker(
        `${process.env.HLTV_ENDPOINT ?? "https://www.hltv.org"}/rss/news`,
        client,
      );
    } catch (error) {
      logger.warn("Error processing RSS feed", error);
    }

    await sleep(getRemainingTimeForInterval(startTime, 10 * TIME_SECOND));
  }
}
