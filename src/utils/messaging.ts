import debounce from "debounce";
import {
  BaseMessageOptions,
  ChannelType,
  Client,
  ForumChannel,
  TextChannel,
  ThreadAutoArchiveDuration,
} from "discord.js";

import { logger } from "../utils/logging";

const FORUM_POST_MAX_LENGTH = 97;

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
  message: BaseMessageOptions,
  autoArchiveDuration: ThreadAutoArchiveDuration = ThreadAutoArchiveDuration.OneHour,
) => {
  if (channel.type === ChannelType.GuildForum) {
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
  message: BaseMessageOptions,
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

  if (name.length > FORUM_POST_MAX_LENGTH) {
    name = `${name.substring(0, FORUM_POST_MAX_LENGTH).trim()}...`;
  }

  let channel;
  client.guilds.cache.forEach((guild) => {
    stats.server.count++;
    stats.server.members += guild.memberCount;

    channel = guild.channels.cache.find(
      (channel) => channel.name === "news-feed",
    );

    if (
      !channel ||
      (channel.type !== ChannelType.GuildText &&
        channel.type !== ChannelType.GuildForum)
    ) {
      return;
    }

    stats.server.withChannel.count++;
    stats.server.withChannel.members += guild.memberCount;

    const role = guild.roles.cache.find((role) => role.name === "hltv");
    let messageWithPing;

    if (role) {
      messageWithPing = {
        ...message,
        content: `${message.content} <@&${role.id}>`,
      };
      stats.server.withChannel.withRole.count++;
      stats.server.withChannel.withRole.members += guild.memberCount;
    }

    let errored: boolean;
    deliverContent(channel, name, messageWithPing ?? message)
      .catch((error: Error) => {
        errored = true;

        const key = error.message;
        stats.message.errors[key] ??= 0;
        stats.message.errors[key]++;
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
