import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

const name = "mute";
const description = "Stop getting notified when HLTV publishes an article";

export default {
  name,
  description,

  data: new SlashCommandBuilder().setName(name).setDescription(description),

  async execute(interaction: CommandInteraction) {
    if (!interaction.inCachedGuild()) return;

    const pingRole = interaction.guild.roles.cache.find(
      (role) => role.name === "hltv",
    );

    if (!pingRole) {
      await interaction.reply({
        content:
          "There is no `@hltv` role in this server for me to remove (you won't get pinged).",
        ephemeral: true,
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
        ephemeral: true,
      })
      .catch(() => {});
  },
};
