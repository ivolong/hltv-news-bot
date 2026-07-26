import { REST } from "@discordjs/rest";
import {
  ActivityType,
  Client,
  Collection,
  SlashCommandBuilder,
} from "discord.js";
import { Routes } from "discord-api-types/v10";
import { readFileSync } from "fs";
import { join } from "path";

import { guildCache } from "../cache/guilds";
import help from "../commands/help";
import invite from "../commands/invite";
import mute from "../commands/mute";
import notify from "../commands/notify";

const liveEventsLocation = join(
  __dirname,
  "..",
  "..",
  "storage",
  `custom_activities.json`,
);

export function updateActivity(client: Client) {
  const serverCount = client.guilds.cache.size;

  let userActivities = [
    {
      name: `${serverCount.toLocaleString("en")} servers`,
      type: ActivityType.Watching,
      state: "Sending the latest stories to #news-feed",
    },
  ];

  const file = readFileSync(liveEventsLocation);
  const customActivities = JSON.parse(file.toString());
  userActivities = userActivities.concat(customActivities.activities);

  const random = Math.floor(Math.random() * userActivities.length);
  if (!userActivities[random]) return;

  client.user?.setPresence({
    activities: [userActivities[random]],
  });
}

export function setCommands(client: Client) {
  const commands: SlashCommandBuilder[] = [];

  client.commands = new Collection();

  for (const command of [help, invite, mute, notify]) {
    commands.push(command.data);
    client.commands.set(command.data.name, command);
  }

  if (process.env.DECLARE_SLASH_COMMANDS === "1") {
    declareSlashCommands(commands);
  }
}

export async function declareSlashCommands(commands: SlashCommandBuilder[]) {
  const rest = new REST({ version: "10" }).setToken(
    process.env.DISCORD_CLIENT_TOKEN!,
  );

  await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
    body: commands,
  });
}

export async function populateCache(client: Client) {
  client.guilds.cache.forEach((guild) => {
    const channel = guild.channels.cache.find(
      (channel) => channel.name === "news-feed",
    );

    if (!channel) return;

    const role = guild.roles.cache.find((role) => role.name === "hltv");

    const guildInfo = {
      channelId: channel.id,
      memberCount: guild.memberCount,
      roleId: role?.id,
    };

    guildCache.set(guild.id, guildInfo);
  });

  return guildCache.size;
}
