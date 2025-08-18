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

export async function updateBotlistMeStats(guildCount: number) {
  const url = `https://api.botlist.me/api/v1/bots/${process.env.DISCORD_CLIENT_ID!}/stats`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.BOTLIST_ME_CLIENT_TOKEN!,
      },
      body: JSON.stringify({
        server_count: guildCount,
      }),
    });

    if (!response.ok) {
      logger.warn("Failed to post to Botlist.me", {
        response: await response.text(),
      });
    } else {
      logger.info("Statistics posted to Botlist.me");
    }
  } catch (error) {
    logger.error("Error while posting to Botlist.me", error);
  }
}

export async function updateDiscordListStats(guildCount: number) {
  const url = `https://api.discordlist.gg/v0/bots/${process.env.DISCORD_CLIENT_ID!}/guilds`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.DISCORD_LIST_CLIENT_TOKEN!,
      },
      body: JSON.stringify({
        count: guildCount,
      }),
    });

    if (!response.ok) {
      logger.warn("Failed to post to Botlist.me", {
        response: await response.text(),
      });
    } else {
      logger.info("Statistics posted to Botlist.me");
    }
  } catch (error) {
    logger.error("Error while posting to Botlist.me", error);
  }
}
