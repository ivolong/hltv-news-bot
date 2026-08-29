import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { getRole, ROLE_NAME } from "../utils/bot";

const name = "mute";
const description = "Stop getting notified when HLTV publishes an article";

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

    const pingRole = getRole(interaction.guild.roles.cache);

    if (!pingRole) {
      await interaction.editReply({
        content: `There is no \`@${ROLE_NAME}\` role in this server for me to remove (you won't get pinged).`,
      });
      return;
    }

    await interaction.member?.roles.remove(pingRole).catch(async () => {
      await interaction.editReply(
        `Sorry, I don't have permission to manage the <@&${pingRole.id}> role. Please contact a server administrator.`,
      );
    });

    await interaction
      .editReply({
        content: "Done, role removed (you won't get pinged).",
      })
      .catch(() => {});
  },
};
