import { CommandInteraction } from "discord.js";

const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("notify")
    .setDescription("Get notified when HLTV publishes an article"),

  async execute(interaction: CommandInteraction) {
    if (!interaction.inCachedGuild()) return;

    const pingRole = interaction.guild?.roles.cache.find(
      (role) => role.name === "hltv",
    );

    if (!pingRole) {
      await interaction.reply({
        content: "Sorry, there is no `@hltv` role in this server.",
        ephemeral: true,
      });
      return;
    }

    await interaction.member?.roles.add(pingRole).catch(async () => {
      await interaction.reply({
        content:
          "Sorry, I don't have permission to do that. Please contact the server administrator.",
        ephemeral: true,
      });
    });

    await interaction
      .reply({
        content: "Done, role added (you'll get a @ping)",
        ephemeral: true,
      })
      .catch(() => {});
  },
};
