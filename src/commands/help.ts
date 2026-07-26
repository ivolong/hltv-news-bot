import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

import { getSlashCommandString } from "../utils/command";
import { inviteButton, supportServerButton } from "../utils/components";

const name = "help";
const description = "Get help on using this bot";

async function getMessageContent(interaction: ChatInputCommandInteraction) {
  const [notify, mute] = getSlashCommandString(
    ["notify", "mute"],
    await interaction.client.application?.commands.fetch(),
  );

  if (!interaction.guild?.members.me) {
    return `In order to work, this bot needs a channel called \`#news-feed\` to post articles in and (optionally) a role called \`@hltv\` to ping with notifications.
    \nWant notifications when there's a new article?
Type ${notify} and I'll ping you.
Type ${mute} and I'll stop pinging you.`;
  }

  const channel = interaction.guild.channels.cache.find(
    (channel) => channel.name === "news-feed",
  );
  const role = interaction.guild.roles.cache.find(
    (role) => role.name === "hltv",
  );

  let hasAllPermissions = true;

  let hasChannelMessage = `:white_check_mark: <#${channel?.id}> found - I'll send new articles there.`;
  if (!channel) {
    hasChannelMessage = ":x: I don't see `#news-feed`. Please create it.";
    hasAllPermissions = false;
  } else if (
    !channel
      .permissionsFor(interaction.guild.members.me)
      .has(PermissionFlagsBits.SendMessages)
  ) {
    hasChannelMessage = `:x: I can't send messages in <#${channel.id}>. Please update my permissions.`;
    hasAllPermissions = false;
  }

  let hasRoleMessage = `:white_check_mark: <@&${role?.id}> found - use ${notify} ${mute} to toggle pings.`;
  if (!role) {
    hasRoleMessage = ":no_bell: I don't see an `@hltv` role. Please create it.";
    hasAllPermissions = false;
  } else if (
    !interaction.guild.members.me.permissions.has(
      PermissionFlagsBits.MentionEveryone,
    )
  ) {
    hasRoleMessage = `:no_bell: I can't ping <@&${role.id}> - please update my permissions.`;
    hasAllPermissions = false;
  }

  const statusMessage = hasAllPermissions
    ? "You are good to go."
    : "Please fix these issues for me to work fully.";

  return `${hasChannelMessage}\n${hasRoleMessage}\n\n${statusMessage}`;
}

export default {
  name,
  description,

  data: new SlashCommandBuilder().setName(name).setDescription(description),

  async execute(interaction: ChatInputCommandInteraction) {
    interaction.reply({
      content: `${await getMessageContent(interaction)}\n\nNeed more help? Looking for something else?`,
      components: [
        {
          type: 1,
          components: [supportServerButton(), inviteButton()],
        },
      ],
    });
  },
};
