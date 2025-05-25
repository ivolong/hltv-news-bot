import { CommandInteraction } from "discord.js";

const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("support")
    .setDescription("Support the running of this bot"),

  async execute(interaction: CommandInteraction) {
    await interaction.reply(
      "Please consider supporting me on [Patreon](https://www.patreon.com/hltvnewsbot) for some cool perks. Thank you!",
    );
  },
};
