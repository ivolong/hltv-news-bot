import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

import { getRole, ROLE_NAME } from "../utils/bot";

const name = "mute";
const description = "Stop getting notified when HLTV publishes an article";

export default {
  name,
  description,

  data: new SlashCommandBuilder().setName(name).setDescription(description),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) return;

    const pingRole = getRole(interaction.guild.roles.cache);

    if (!pingRole) {
      await interaction.reply({
        content: `There is no \`@${ROLE_NAME}\` role in this server for me to remove (you won't get pinged).`,
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.member?.roles.remove(pingRole).catch(async () => {
      await interaction.reply(
        `Sorry, I don't have permission to manage the <@&${pingRole.id}> role. Please contact a server administrator.`,
      );
    });

    await interaction
      .reply({
        content: "Done, role removed (you won't get pinged).",
        flags: MessageFlags.Ephemeral,
      })
      .catch(() => {});
  },
};
