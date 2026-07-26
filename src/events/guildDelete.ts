import { Client, Guild } from "discord.js";

import { guildCache } from "../cache/guilds";
import { logger } from "../utils/logging";

export default async function guildDelete(client: Client, guild: Guild) {
  const guildInfo = guildCache.get(guild.id);

  logger.info("Removed from guild", {
    name: guild.name,
    memberCount: guildInfo?.memberCount,
    hasChannel: Boolean(guildInfo?.channelId),
    hasRole: Boolean(guildInfo?.roleId),
  });

  guildCache.delete(guild.id);
}
