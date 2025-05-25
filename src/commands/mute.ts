import { CommandInteraction } from "discord.js";

const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Stop getting notified when HLTV publishes an article"),

  async execute(interaction: CommandInteraction) {
    if (!interaction.inCachedGuild()) return;

    const pingRole = interaction.guild.roles.cache.find(
      (role) => role.name === "hltv",
    );

    if (!pingRole) {
      await interaction.reply({
        content:
          "There is no `@hltv` role in this server for me to remove from you.",
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
