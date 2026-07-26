import { Client, Guild } from "discord.js";

import { logger } from "../utils/logging";

export default async function guildDelete(client: Client, guild: Guild) {
  const channel = guild.channels.cache.find(
    (channel) => channel.name === "news-feed",
  );
  const role = guild.roles.cache.find((role) => role.name === "hltv");

  logger.info("Removed from guild", {
    name: guild.name,
    memberCount: guild.memberCount,
    hasChannel: Boolean(channel),
    hasRole: Boolean(role),
  });
}
