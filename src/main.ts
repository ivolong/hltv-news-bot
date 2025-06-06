import { Client, Intents } from "discord.js";
import { AutoPoster } from "topgg-autoposter";

import guildCreate from "./events/guildCreate.js";
import interactionCreate from "./events/interactionCreate.js";
import newArticle from "./events/newArticle.js";
import ready from "./events/ready.js";
import { logger } from "./utils/logging.js";

const client = new Client({
  restRequestTimeout: 60000,
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

AutoPoster(process.env.TOPGG_CLIENT_TOKEN!, client).on("posted", () => {
  logger.info("Statistics posted to Top.gg");

  updateDiscordBotsGgStats(client.guilds.cache.size);
});

client.on("ready", ready.bind(null, client));
client.on("guildCreate", guildCreate.bind(null, client));
client.on("interactionCreate", interactionCreate.bind(null, client));
client.on("newArticle", newArticle.bind(null, client));

client.login(process.env.DISCORD_CLIENT_TOKEN);
