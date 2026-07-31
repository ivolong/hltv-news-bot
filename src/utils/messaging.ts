import {
  BaseMessageOptions,
  ChannelType,
  Client,
  ForumChannel,
  TextChannel,
  ThreadAutoArchiveDuration,
} from "discord.js";

import { logger } from "../utils/logging";
import { getChannel, getRole } from "./bot";

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
    errors: Record<string, number>;
    members: number;
    roles: number;
  };
};

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

export const deliverContentToAll = async (
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

  const deliveries = client.guilds.cache.map(async (guild) => {
    stats.server.count++;
    stats.server.members += guild.memberCount;

    const channel = getChannel(guild.channels.cache);
    if (!channel) return;

    stats.server.withChannel.count++;
    stats.server.withChannel.members += guild.memberCount;

    const role = getRole(guild.roles.cache);
    let messageWithPing;

    if (role) {
      messageWithPing = {
        ...message,
        content: `${message.content} <@&${role.id}>`,
      };
      stats.server.withChannel.withRole.count++;
      stats.server.withChannel.withRole.members += guild.memberCount;
    }

    try {
      await deliverContent(channel, name, messageWithPing ?? message);
      stats.message.members += guild.memberCount;

      if (role) stats.message.roles++;
    } catch (error) {
      const key = error instanceof Error ? error.message : String(error);
      stats.message.errors[key] ??= 0;
      stats.message.errors[key]++;
    }
  });

  await Promise.allSettled(deliveries);
  logger.info(`Content delivered to guilds`, { id, stats });
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

  return deliverContentToAll(client, title, message);
};
