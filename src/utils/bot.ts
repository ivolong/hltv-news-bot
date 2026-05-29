import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { ActivitiesOptions, Client, Collection } from "discord.js";
import { Routes } from "discord-api-types/v9";
import { readFileSync } from "fs";
import { join } from "path";

import help from "../commands/help.js";
import invite from "../commands/invite.js";
import mute from "../commands/mute.js";
import notify from "../commands/notify.js";
import { logger } from "../utils/logging.js";

const liveEventsLocation = join(
  __dirname,
  "..",
  "..",
  "storage",
  `custom_activities.json`,
);

export function updateActivity(client: Client) {
  const serverCount = client.guilds.cache.size;

  let userActivities: ActivitiesOptions[] = [
    {
      name: `${serverCount.toLocaleString("en")} servers`,
      type: "WATCHING" as const,
      state: "Sending the latest stories to #news-feed",
    },
  ];

  const file = readFileSync(liveEventsLocation);
  const customActivities = JSON.parse(file.toString());
  userActivities = userActivities.concat(customActivities.activities);

  const random = Math.floor(Math.random() * userActivities.length);
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

  const rest = new REST({ version: "9" }).setToken(
    process.env.DISCORD_CLIENT_TOKEN!,
  );

  try {
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!), {
      body: commands,
    });
  } catch (error) {
    logger.error("Error declaring slash commands:", error);
  }
}
