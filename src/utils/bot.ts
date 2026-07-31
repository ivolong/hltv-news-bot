import { REST } from "@discordjs/rest";
import {
  ActivityType,
  ChannelType,
  Client,
  Collection,
  ForumChannel,
  GuildBasedChannel,
  Role,
  SlashCommandBuilder,
  Snowflake,
  TextChannel,
} from "discord.js";
import { Routes } from "discord-api-types/v10";
import { readFileSync } from "fs";
import { join } from "path";

import help from "../commands/help";
import invite from "../commands/invite";
import mute from "../commands/mute";
import notify from "../commands/notify";
import { logger } from "../utils/logging";

const liveEventsLocation = join(
  __dirname,
  "..",
  "..",
  "storage",
  `custom_activities.json`,
);

export const CHANNEL_NAME = "news-feed";
const SUPPORTED_CHANNEL_TYPES = [ChannelType.GuildText, ChannelType.GuildForum];
export const ROLE_NAME = "hltv";

export function getChannel(cache: Collection<string, GuildBasedChannel>) {
  const channel = cache.find(
    (channel) =>
      channel.name === CHANNEL_NAME &&
      SUPPORTED_CHANNEL_TYPES.includes(channel.type),
  );

  return (channel as TextChannel | ForumChannel) || undefined;
}

export function getRole(cache: Collection<Snowflake, Role>) {
  return cache.find((role) => role.name === ROLE_NAME);
}

export function updateActivity(client: Client) {
  const serverCount = client.guilds.cache.size;

  let userActivities = [
    {
      name: `${serverCount.toLocaleString("en")} servers`,
      type: ActivityType.Watching,
      state: `Sending the latest stories to #${CHANNEL_NAME}`,
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
  logger.info("Loading commands");

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
  logger.info("Declaring slash commands", { commands });

  const rest = new REST({ version: "10" }).setToken(
    process.env.DISCORD_CLIENT_TOKEN!,
  );

  try {
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
      body: commands,
    });
  } catch (error) {
    logger.error("Error declaring slash commands", error);
  }
}
