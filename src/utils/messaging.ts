import debounce from "debounce";
import {
  Client,
  ForumChannel,
  GuildForumThreadMessageCreateOptions,
  TextChannel,
  ThreadAutoArchiveDuration,
} from "discord.js";

import { logger } from "../utils/logging.js";

type StatsType = {
  server: {
    count: number;
    members: number;
    withChannel: {
      count: number;
      members: number;
      withRole: {
        count: number;
        members: number;
      };
    };
  };
  message: {
    errors: { [key: string]: number };
    members: number;
    roles: number;
  };
};

const logStats = debounce((stats, id) => {
  logger.info(`Content delivered to guilds`, { id, stats });
}, 10e3);

const deliverContent = (
  channel: TextChannel | ForumChannel,
  name: string,
  message: GuildForumThreadMessageCreateOptions,
  autoArchiveDuration: ThreadAutoArchiveDuration = 60,
) => {
  if (channel.type === "GUILD_FORUM") {
    return channel.threads.create({
      name,
      autoArchiveDuration,
      message,
    });
  }

  return channel.send(message);
};

export const deliverContentToAll = (
  client: Client,
  name: string,
  message: GuildForumThreadMessageCreateOptions,
  id?: string,
) => {
  logger.info("Sending content to guilds", { id });

  const stats: StatsType = {
    server: {
      count: 0,
      members: 0,
      withChannel: {
        count: 0,
        members: 0,
        withRole: {
          count: 0,
          members: 0,
        },
      },
    },
    message: {
      errors: {},
      members: 0,
      roles: 0,
    },
  };

  let channel;
  const messageWithPing = { ...message };
  client.guilds.cache.forEach((guild) => {
    stats.server.count++;
    stats.server.members += guild.memberCount;

    channel = guild.channels.cache.find(
      (channel) => channel.name === "news-feed",
    );

    if (
      !channel ||
      (channel.type !== "GUILD_TEXT" && channel.type !== "GUILD_FORUM")
    ) {
      return;
    }

    stats.server.withChannel.count++;
    stats.server.withChannel.members += guild.memberCount;

    const role = guild.roles.cache.find((role) => role.name === "hltv");

    if (role) {
      messageWithPing.content = `${message.content} <@&${role.id}>`;
      stats.server.withChannel.withRole.count++;
      stats.server.withChannel.withRole.members += guild.memberCount;
    }

    let errored: boolean;
    deliverContent(channel, name, messageWithPing)
      .catch((error: Error) => {
        errored = true;

        if (!(error.message in stats.message.errors)) {
          stats.message.errors[error.message] = 0;
        }
        stats.message.errors[error.message]++;
      })
      .finally(() => {
        if (!errored) {
          stats.message.members += guild.memberCount;

          if (role) stats.message.roles++;
        }

        logStats(stats, id);
      });
  });
};

export const postUpdate = (
  client: Client,
  content: string,
  title: string,
  description: string,
) => {
  const message = {
    content,
    embeds: [
      {
        title,
        description,
      },
    ],
  };

  deliverContentToAll(client, title, message);
};
