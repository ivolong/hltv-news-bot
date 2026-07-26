import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { getSlashCommandString } from "../utils/command";
import { inviteButton } from "../utils/components";

const name = "invite";
const description = "Get HLTV News notifications in your server";

export default {
  name,
  description,

  data: new SlashCommandBuilder().setName(name).setDescription(description),

  async execute(interaction: ChatInputCommandInteraction) {
    const [help] = getSlashCommandString(
      ["help"],
      await interaction.client.application?.commands.fetch(),
    );

    interaction.reply({
      content: `Add me to your server and follow the required steps. Check out ${help} for assistance.`,
      components: [
        {
          type: 1,
          components: [inviteButton()],
        },
      ],
    });
  },
};
