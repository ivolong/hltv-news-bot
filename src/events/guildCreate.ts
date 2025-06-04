import { Client, Guild } from "discord.js";

const commandUtils = require("../utils/command.js");
import { logger } from "../utils/logging.js";

module.exports = async (client: Client, guild: Guild) => {
  logger.info("Added to new guild", guild);

  guild.roles
    .create({
      name: "hltv",
      color: "#3c6ea1",
      reason: "Receives HLTV News article notifications.",
    })
    .catch((error) => {
      logger.error("Unable to create role", error);
    });

  const [notify, mute, help, invite] = commandUtils.getSlashCommandString(
    await client.application?.commands.fetch(),
    ["notify", "mute", "help", "invite"],
  );

  guild.channels
    .create("news-feed", {
      reason: "News feed from HLTV.",
    })
    .then((channel) => {
      channel
        .send({
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
          logger.error("Unable to send welcome message", error);
        });
    })
    .catch((error) => {
      logger.error("Unable to create channel", error);
    });
};
