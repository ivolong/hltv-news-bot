import { Client, GatewayIntentBits } from "discord.js";

import clientReady from "./events/clientReady";
import guildCreate from "./events/guildCreate";
import guildDelete from "./events/guildDelete";
import interactionCreate from "./events/interactionCreate";
import newArticle from "./events/newArticle";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.on("clientReady", clientReady.bind(null, client));
client.on("guildCreate", guildCreate.bind(null, client));
client.on("guildDelete", guildDelete.bind(null, client));
client.on("interactionCreate", interactionCreate.bind(null, client));
client.on("newArticle", newArticle.bind(null, client));

client.login(process.env.DISCORD_CLIENT_TOKEN);
