import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { getRole, ROLE_NAME } from "../utils/bot";
import { logger } from "../utils/logging";

const name = "notify";
const description = "Get notified when HLTV publishes an article";

export default {
  name,
  description,
  ephemeral: true,

  data: new SlashCommandBuilder().setName(name).setDescription(description),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) {
      await interaction.editReply({
        content: "This command must be used in a server channel.",
      });
      return;
    }

    const pingRole = getRole(interaction.guild?.roles.cache);

    if (!pingRole) {
      await interaction.editReply({
        content: `There is no \`@${ROLE_NAME}\` role in this server for me to assign (you won't get pinged).`,
      });
      return;
    }

    try {
      await interaction.member?.roles.add(pingRole);
    } catch (error) {
      logger.warn("Failed to add user to role", error);
      await interaction.editReply(
        `Sorry, I wasn't able to add you to the <@&${pingRole.id}> role. Please try again or contact the server administrator.`,
      );
      return;
    }

    interaction.editReply({
      content: "Done, role added (you'll get a @ping).",
    });
  },
};
