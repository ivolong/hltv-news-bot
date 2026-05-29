import { Client, Guild } from "discord.js";

import { logger } from "../utils/logging.js";

export default async function guildDelete(client: Client, guild: Guild) {
  const channel = guild.channels.cache.find(
    (channel) => channel.name === "news-feed",
  );
  const role = guild.roles.cache.find((role) => role.name === "hltv");

  const info = {
    id: guild.id,
    name: guild.name,
    icon: guild.iconURL(),
    memberCount: guild.memberCount,
    hasChannel: Boolean(channel),
    hasRole: Boolean(role),
  };

  logger.info("Removed from guild", info);
}
