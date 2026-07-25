import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

const name = "notify";
const description = "Get notified when HLTV publishes an article";

export default {
  name,
  description,

  data: new SlashCommandBuilder().setName(name).setDescription(description),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) return;

    const pingRole = interaction.guild?.roles.cache.find(
      (role) => role.name === "hltv",
    );

    if (!pingRole) {
      await interaction.reply({
        content:
          "There is no `@hltv` role in this server for me to assign (you won't get pinged).",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    await interaction.member?.roles.add(pingRole).catch(async () => {
      await interaction.reply(
        `Sorry, I don't have permission to manage the <@&${pingRole.id}> role. Please contact the server administrator.`,
      );
    });

    await interaction
      .reply({
        content: "Done, role added (you'll get a @ping).",
        flags: MessageFlags.Ephemeral,
      })
      .catch(() => {});
  },
};
