import { logger } from "./logging";

export async function updateDiscordBotsGgStats(guildCount: number) {
  const url = `https://discord.bots.gg/api/v1/bots/${process.env.DISCORD_CLIENT_ID!}/stats`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.DISCORD_BOTS_GG_TOKEN!,
      },
      body: JSON.stringify({
        guildCount,
      }),
    });

    if (!response.ok) {
      logger.warn("Failed to post to Discord Bots.gg", {
        response: await response.text(),
      });
    } else {
      logger.info("Statistics posted to Discord Bots.gg");
    }
  } catch (error) {
    logger.error("Error while posting to Discord Bots.gg", error);
  }
}
