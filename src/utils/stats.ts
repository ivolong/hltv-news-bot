import { logger } from "./logging";

const statBrokers = [
  {
    getUrl: (id: string) => `https://top.gg/api/bots/${id}/stats`,
    getToken: () => process.env.TOPGG_CLIENT_TOKEN,
    getAuthHeader: (token: string) => `${token}`,
    getBody: (guildCount: number) => {
      return { server_count: guildCount };
    },
  },
  {
    getUrl: (id: string) => `https://discord.bots.gg/api/v1/bots/${id}/stats`,
    getToken: () => process.env.DISCORD_BOTS_GG_TOKEN,
    getAuthHeader: (token: string) => `${token}`,
    getBody: (guildCount: number) => {
      return { guildCount };
    },
  },
  {
    getUrl: (id: string) => `https://api.botlist.me/api/v1/bots/${id}/stats`,
    getToken: () => process.env.BOTLIST_ME_CLIENT_TOKEN,
    getAuthHeader: (token: string) => `${token}`,
    getBody: (guildCount: number) => {
      return { server_count: guildCount };
    },
  },
  {
    getUrl: (id: string) => `https://api.discordlist.gg/v0/bots/${id}/guilds`,
    getToken: () => process.env.DISCORD_LIST_CLIENT_TOKEN,
    getAuthHeader: (token: string) => `Bearer ${token}`,
    getBody: (guildCount: number) => {
      return { count: guildCount };
    },
  },
];

export async function updateStats(guildCount: number) {
  statBrokers.forEach(async (broker) => {
    const token = broker.getToken();
    if (!token) return;

    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: broker.getAuthHeader(token),
      },
      body: JSON.stringify(broker.getBody(guildCount)),
    };

    const url = broker.getUrl(process.env.DISCORD_CLIENT_ID!);
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
  });
}
