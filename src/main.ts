import { Client, Events, GatewayIntentBits } from "discord.js";

import channelUpdate from "./events/channelUpdate";
import clientReady from "./events/clientReady";
import guildCreate from "./events/guildCreate";
import guildDelete from "./events/guildDelete";
import interactionCreate from "./events/interactionCreate";
import newArticle, { EventNewArticle } from "./events/newArticle";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.on(Events.ChannelUpdate, (oldChannel, newChannel) => {
  channelUpdate(oldChannel, newChannel);
});
client.on(Events.ClientReady, (client) => {
  clientReady(client);
});
client.on(Events.GuildCreate, (guild) => {
  guildCreate(client, guild);
});
client.on(Events.GuildDelete, (guild) => {
  guildDelete(client, guild);
});
client.on(Events.InteractionCreate, (interaction) => {
  interactionCreate(client, interaction);
});
client.on(EventNewArticle, (article) => {
  newArticle(client, article);
});

client.login(process.env.DISCORD_CLIENT_TOKEN);
