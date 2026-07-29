import { Client, Guild } from "discord.js";

import { getChannel, getRole } from "../utils/bot";
import { logger } from "../utils/logging";

export default async function guildDelete(client: Client, guild: Guild) {
  logger.info("Removed from guild", {
    name: guild.name,
    memberCount: guild.memberCount,
    hasChannel: Boolean(getChannel(guild.channels.cache)),
    hasRole: Boolean(getRole(guild.roles.cache)),
  });
}
