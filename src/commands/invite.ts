import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import { getSlashCommandString } from "../utils/command.js";

const name = "invite";
const description = "Get HLTV News notifications in your server";

export default {
  name,
  description,

  data: new SlashCommandBuilder().setName(name).setDescription(description),

  async execute(interaction: CommandInteraction) {
    const [help] = getSlashCommandString(
      ["help"],
      await interaction.client.application?.commands.fetch(),
    );

    interaction.reply(
      `Click on my name (<@${process.env.DISCORD_CLIENT_ID}>), then \`+ Add App\` and follow the required steps. Check out ${help} for assistance.`,
    );
  },
};
