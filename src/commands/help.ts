import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import { getSlashCommandString } from "../utils/command.js";

const name = "help";
const description = "Get help on using this bot";

export default {
  name,
  description,

  data: new SlashCommandBuilder().setName(name).setDescription(description),

  async execute(interaction: CommandInteraction) {
    const [notify, mute, invite] = getSlashCommandString(
      ["notify", "mute", "invite"],
      await interaction.client.application?.commands.fetch(),
    );

    interaction.reply(
      `In order to work, this bot needs a channel called \`#news-feed\` to post articles in and (optionally) a role called \`@hltv\` to ping with notifications.\n\nWant notifications when there's a new article?\nType ${notify} and I'll ping you.\nType ${mute} and I'll stop pinging you.\n\n${invite} to invite me to your server.\n\nJoin our server for further assistance: https://discord.gg/dE3NFqTzEx`,
    );
  },
};
