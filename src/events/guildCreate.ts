import { ChannelType, Client, Guild } from "discord.js";

import { guildCache } from "../cache/guilds";
import { getSlashCommandString } from "../utils/command";
import {
  inviteButton,
  supportButton,
  supportServerButton,
} from "../utils/components";
import { logger } from "../utils/logging";

export default async function guildCreate(client: Client, guild: Guild) {
  let createdChannel = false;
  let createdRole = false;

  let role;
  try {
    role = await guild.roles.create({
      name: "hltv",
      colors: {
        primaryColor: "#3c6ea1",
      },
      reason: "Receives HLTV News article notifications.",
    });
    createdRole = true;
  } catch (error) {
    logger.warn("Unable to create role", error);
  }

  const [notify, mute, help] = getSlashCommandString(
    ["notify", "mute", "help"],
    await client.application?.commands.fetch(),
  );

  let channel;
  try {
    channel = await guild.channels.create({
      name: "news-feed",
      type: ChannelType.GuildText,
      reason: "News feed from HLTV.",
    });
    createdChannel = true;
  } catch (error) {
    logger.warn("Unable to create channel", error);
  }

  if (channel && channel.isTextBased()) {
    channel
      .send({
        content: "https://discord.gg/dE3NFqTzEx",
        embeds: [
          {
            title: `${client.user?.displayName}`,
            color: 0x3c6ea1,
            url: "https://ko-fi.com/ivolong",
            description: `I'll post new articles from HLTV in here. **Please do not rename this channel** but feel free to move it around.\n\nDo you want notifications?\nType ${notify} and I'll ping you with new stories.\nType ${mute} to stop being pinged.\n\nType ${help} for general help.`,
            author: {
              name: `Thank you for using ${client.user?.displayName}`,
              icon_url: `${client.user?.displayAvatarURL()}`,
              url: "https://ko-fi.com/ivolong",
            },
            footer: {
              text: "Not affiliated with HLTV.org or Better Collective A/S.",
              icon_url: `${client.user?.displayAvatarURL()}`,
            },
          },
        ],
        components: [
          {
            type: 1,
            components: [
              supportButton(),
              inviteButton(),
              supportServerButton(),
            ],
          },
        ],
      })
      .catch((error: Error) => {
        logger.warn("Unable to send welcome message", error);
      });
  }

  if (channel) {
    guildCache.set(guild.id, {
      channelId: channel.id,
      roleId: role?.id,
      memberCount: guild.memberCount,
    });
  }

  logger.info("Added to new guild", {
    name: guild.name,
    memberCount: guild.memberCount,
    createdChannel,
    createdRole,
  });
}
