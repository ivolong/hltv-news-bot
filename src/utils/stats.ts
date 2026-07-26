import { logger } from "./logging";

export async function updateStats(guildCount: number) {
  updateTopGg(guildCount);
  updateDiscordBotsGg(guildCount);
  updateBotlistMe(guildCount);
  updateDiscordList(guildCount);
}

async function update(url: string, request: RequestInit) {
  let response;
  try {
    response = await fetch(url, request);
  } catch (error) {
    logger.warn("Error while posting statistics", url, error);
    return;
  }

  if (!response.ok) {
    logger.warn("Unexpected response while posting statistics", url, {
      response: await response.text(),
    });
  }
}

async function updateTopGg(guildCount: number) {
  if (!process.env.TOPGG_CLIENT_TOKEN) return;

  const url = `https://top.gg/api/bots/${process.env.DISCORD_CLIENT_ID!}/stats`;

  await update(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.TOPGG_CLIENT_TOKEN,
    },
    body: JSON.stringify({ server_count: guildCount }),
  });
}

async function updateDiscordBotsGg(guildCount: number) {
  if (!process.env.DISCORD_BOTS_GG_TOKEN) return;

  const url = `https://discord.bots.gg/api/v1/bots/${process.env.DISCORD_CLIENT_ID!}/stats`;

  await update(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.DISCORD_BOTS_GG_TOKEN,
    },
    body: JSON.stringify({ guildCount }),
  });
}

async function updateBotlistMe(guildCount: number) {
  if (!process.env.BOTLIST_ME_CLIENT_TOKEN) return;

  const url = `https://api.botlist.me/api/v1/bots/${process.env.DISCORD_CLIENT_ID!}/stats`;

  await update(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.BOTLIST_ME_CLIENT_TOKEN,
    },
    body: JSON.stringify({ server_count: guildCount }),
  });
}

async function updateDiscordList(guildCount: number) {
  if (!process.env.DISCORD_LIST_CLIENT_TOKEN) return;

  const url = `https://api.discordlist.gg/v0/bots/${process.env.DISCORD_CLIENT_ID!}/guilds`;

  await update(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DISCORD_LIST_CLIENT_TOKEN}`,
    },
    body: JSON.stringify({ count: guildCount }),
  });
}
