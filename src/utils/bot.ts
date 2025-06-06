import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Client, Collection } from "discord.js";
import { Routes } from "discord-api-types/v9";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import Parser, { Output } from "rss-parser";

import help from "../commands/help.js";
import invite from "../commands/invite.js";
import mute from "../commands/mute.js";
import notify from "../commands/notify.js";
import { HltvArticle } from "../events/newArticle.js";
import { logger } from "../utils/logging.js";

const rss = new Parser({
  customFields: {
    item: ["pubDate", ["media:content", "media", { keepArray: false }]],
  },
  timeout: 5000,
});

export function updateActivity(client: Client) {
  const serverCount = client.guilds.cache.size;

  const userActivityString = `/help | ${serverCount.toLocaleString("en")} servers`;

  client.user?.setActivity(userActivityString, { type: "WATCHING" });
}

export function postUpdate(
  client: Client,
  content: string,
  title: string,
  description: string,
) {
  const message = {
    content,
    embeds: [
      {
        title,
        description,
      },
    ],
  };

  logger.info("Posting update to servers", message);

  let channel;
  client.guilds.cache.forEach((guild) => {
    channel = guild.channels.cache.find(
      (channel) => channel.name === "news-feed",
    );

    if (!channel || channel.type !== "GUILD_TEXT") return;

    channel.send(message).catch(() => {});
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
    logger.error("Error declaring slash commands", error);
  }
}

export function rssChecker(name: string, url: string, client: Client) {
  const articleStorageFileLocation = join(
    __dirname,
    "..",
    "..",
    "storage",
    `current_${name}_article.json`,
  );

  (async () => {
    await rss.parseURL(url, function (error: Error, feed: Output<HltvArticle>) {
      if (error) {
        logger.error(`Error processing RSS feed ${url}`, error);
        return;
      }

      const newestArticle = feed.items[0];

      const file = readFileSync(articleStorageFileLocation);
      const currentArticle = JSON.parse(file.toString());

      const currentArticleDate = new Date(currentArticle.pubDate);
      const newestArticleDate = new Date(newestArticle.pubDate);
      const isStale = newestArticleDate < currentArticleDate;

      if (
        currentArticle.guid &&
        newestArticle.guid !== currentArticle.guid &&
        !isStale
      ) {
        const data = JSON.stringify(newestArticle);
        writeFileSync(articleStorageFileLocation, data);
        client.emit("newArticle", newestArticle);
      }
    });
  })();
}
