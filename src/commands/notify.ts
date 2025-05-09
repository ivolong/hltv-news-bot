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
      await interaction.reply(
        "Sorry, there is no `@hltv` role in this server.",
      );
      return;
    }

    await interaction.member?.roles.add(pingRole);

    await interaction
      .reply("Done, role added (you'll get a @ping)")
      .catch(() => {});
  },
};
