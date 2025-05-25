import { Client, Guild } from "discord.js";

const commandUtils = require("../utils/command.js");
import { logger } from "../utils/logging.js";

module.exports = async (client: Client, guild: Guild) => {
  logger.info("guildCreate", guild);

  guild.roles
    .create({
      name: "hltv",
      color: "#3c6ea1",
      reason: "Pingable HLTV role by HLTV News bot.",
    })
    .catch(() => {});

  const [notify, mute, help, invite] = commandUtils.getSlashCommandString(
    await client.application?.commands.fetch(),
    ["notify", "mute", "help", "invite"],
  );

  guild.channels
    .create("news-feed", {
      reason: "HLTV news article updates channel by HLTV News bot.",
    })
    .then((channel) => {
      channel
        .send({
          content:
            "https://discord.gg/dE3NFqTzEx https://www.patreon.com/hltvnewsbot",
          embeds: [
            {
              title: "Information",
              description: `Thanks for adding me.\n\nI'll post new articles from HLTV in here. **Please do not rename this channel** but feel free to move it around.\n\nDo you want notifications?\nType ${notify} and I'll give you a pingable role.\nType ${mute} to remove the role.\n\nType ${help} for general help.\n\nType ${invite} to invite me to your server.\n\nJoin [here](https://discord.gg/dE3NFqTzEx) for assistance.\n\nPlease consider supporting me on [Patreon](https://www.patreon.com/hltvnewsbot). Thank you!`,
            },
          ],
        })
        .catch(() => {});
    })
    .catch(() => {});
};
