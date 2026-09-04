import { Client } from "discord.js";
import { writeHeapSnapshot } from "v8";

import { setCommands, updateActivity } from "../utils/bot";
import { logger } from "../utils/logging";
import { rssChecker } from "../utils/rss";
import { updateStats } from "../utils/stats";

export const TIME_SECOND = 1000;

export function sleep(milliseconds: number) {
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

function logProcessStats(client: Client) {
  const processUsage = process.memoryUsage();

  logger.info("Memory usage summary", {
    rssUsed: (processUsage.rss / 1024 / 1024).toFixed(1),
    heapUsed: (processUsage.heapUsed / 1024 / 1024).toFixed(1),
    caches: {
      guilds: client.guilds.cache.size,
      users: client.users.cache.size,
      channels: client.channels.cache.size,
    },
  });

  writeHeapSnapshot();
}

export default async function clientReady(client: Client) {
  logger.info("Online");

  setCommands(client);

  setInterval(updateActivity, 60 * TIME_SECOND, client);

  setInterval(() => updateStats(client.guilds.cache.size), 600 * TIME_SECOND);

  setInterval(logProcessStats, 2 * 60 * 60 * TIME_SECOND, client);

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
