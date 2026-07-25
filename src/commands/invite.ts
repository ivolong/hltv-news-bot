import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import { getSlashCommandString } from "../utils/command";

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

    interaction.reply({
      content: `Add me to your server and follow the required steps. Check out ${help} for assistance.`,
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: "LINK",
              label: "Add to your server",
              url: `https://discord.com/oauth2/authorize?client_id=${interaction.client.application?.id}`,
            },
          ],
        },
      ],
    });
  },
};
