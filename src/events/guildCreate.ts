import { Client, Guild } from "discord.js";

import { getSlashCommandString } from "../utils/command.js";
import { logger } from "../utils/logging.js";

export default async function guildCreate(client: Client, guild: Guild) {
  let createdChannel = false;
  let createdRole = false;

  try {
    await guild.roles.create({
      name: "hltv",
      color: "#3c6ea1",
      reason: "Receives HLTV News article notifications.",
    });
    createdRole = true;
  } catch (error) {
    logger.warn("Unable to create role:", error);
  }

  const [notify, mute, help, invite] = getSlashCommandString(
    ["notify", "mute", "help", "invite"],
    await client.application?.commands.fetch(),
  );

  let channel;
  try {
    channel = await guild.channels.create("news-feed", {
      reason: "News feed from HLTV.",
    });
    createdChannel = true;
  } catch (error) {
    logger.warn("Unable to create channel:", error);
  }

  channel
    ?.send({
      content: "https://discord.gg/dE3NFqTzEx",
      embeds: [
        {
          title: client.user?.displayName,
          color: 0x3c6ea1,
          url: "https://ko-fi.com/ivolong",
          description: `I'll post new articles from HLTV in here. **Please do not rename this channel** but feel free to move it around.\n\nDo you want notifications?\nType ${notify} and I'll ping you with new stories.\nType ${mute} to stop being pinged.\n\nType ${help} for general help.\n\nType ${invite} to invite me to your server.\n\n**Need more help?** [Get help](https://discord.gg/dE3NFqTzEx)\n\nPlease consider [supporting me](https://ko-fi.com/ivolong) running this bot - thank you! ❤️`,
          author: {
            name: `Thank you for using ${client.user?.displayName}`,
            icon_url: client.user?.displayAvatarURL(),
            url: "https://ko-fi.com/ivolong",
          },
          footer: {
            text: "Not affiliated with HLTV.org or Better Collective A/S.",
            icon_url: client.user?.displayAvatarURL(),
          },
        },
      ],
    })
    .catch((error) => {
      logger.warn("Unable to send welcome message:", error);
    });

  const info = {
    id: guild.id,
    name: guild.name,
    icon: guild.iconURL(),
    memberCount: guild.memberCount,
    createdChannel,
    createdRole,
  };

  logger.info("Added to new guild", info);
}
