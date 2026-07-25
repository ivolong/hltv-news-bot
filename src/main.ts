import { Client, Intents } from "discord.js";
import { AutoPoster } from "topgg-autoposter";

import guildCreate from "./events/guildCreate";
import guildDelete from "./events/guildDelete";
import interactionCreate from "./events/interactionCreate";
import newArticle from "./events/newArticle";
import ready from "./events/ready";
import { logger } from "./utils/logging";
import {
  updateBotlistMeStats,
  updateDiscordBotsGgStats,
  updateDiscordListStats,
} from "./utils/third-parties";

const client = new Client({
  restRequestTimeout: 60000,
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

if (process.env.TOPGG_CLIENT_TOKEN) {
  AutoPoster(process.env.TOPGG_CLIENT_TOKEN, client).on("posted", () => {
    logger.info("Statistics posted to Top.gg");

    updateDiscordBotsGgStats(client.guilds.cache.size);
    updateBotlistMeStats(client.guilds.cache.size);
    updateDiscordListStats(client.guilds.cache.size);
  });
}

client.on("ready", ready.bind(null, client));
client.on("guildCreate", guildCreate.bind(null, client));
client.on("guildDelete", guildDelete.bind(null, client));
client.on("interactionCreate", interactionCreate.bind(null, client));
client.on("newArticle", newArticle.bind(null, client));

client.login(process.env.DISCORD_CLIENT_TOKEN);
