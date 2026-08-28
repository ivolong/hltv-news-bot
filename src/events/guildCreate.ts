import { ChannelType, Client, Guild, PermissionFlagsBits } from "discord.js";

import { CHANNEL_NAME, REQUIRED_PERMISISONS, ROLE_NAME } from "../utils/bot";
import { getSlashCommandString } from "../utils/command";
import {
  inviteButton,
  supportButton,
  supportServerButton,
} from "../utils/components";
import { logger } from "../utils/logging";

export default async function guildCreate(client: Client, guild: Guild) {
  let createdChannel = false;
  let createdRole = false;

  if (guild.members.me?.permissions.has(PermissionFlagsBits.ManageRoles)) {
    try {
      await guild.roles.create({
        name: ROLE_NAME,
        colors: {
          primaryColor: "#3c6ea1",
        },
        reason: "Receives HLTV News article notifications.",
      });
      createdRole = true;
    } catch (error) {
      logger.warn("Failed to create role", error);
    }
  }

  const [notify, mute, help] = getSlashCommandString(
    ["notify", "mute", "help"],
    await client.application?.commands.fetch(),
  );

  let channel;

  if (guild.members.me?.permissions.has(PermissionFlagsBits.ManageChannels)) {
    try {
      channel = await guild.channels.create({
        name: CHANNEL_NAME,
        type: ChannelType.GuildText,
        reason: "News feed from HLTV.",
      });
      createdChannel = true;
    } catch (error) {
      logger.warn("Failed to create channel", error);
    }
  }

  if (
    channel &&
    channel.isTextBased() &&
    guild.members.me?.permissions.has(PermissionFlagsBits.SendMessages)
  ) {
    channel
      .send({
        content: "https://discord.gg/dE3NFqTzEx",
        embeds: [
          {
            title: `${client.user?.displayName}`,
            color: 0x3c6ea1,
            url: "https://ko-fi.com/ivolong",
            description: `I'll post new articles from HLTV in here. **Please do not rename this channel** but feel free to move it around.\n\nDo you want notifications?\nType ${notify} and I'll ping you with new stories.\nType ${mute} to stop being pinged.\n\nType ${help} for general help.`,
            author: {
              name: `Thank you for using ${client.user?.displayName}`,
              icon_url: `${client.user?.displayAvatarURL()}`,
              url: "https://ko-fi.com/ivolong",
            },
            footer: {
              text: "Not affiliated with HLTV.org or Better Collective A/S.",
              icon_url: `${client.user?.displayAvatarURL()}`,
            },
          },
        ],
        components: [
          {
            type: 1,
            components: [
              supportButton(),
              inviteButton(),
              supportServerButton(),
            ],
          },
        ],
      })
      .catch((error: Error) => {
        logger.warn("Failed to send welcome message", error);
      });
  }

  const missingPermissions = REQUIRED_PERMISISONS.filter(
    (permission) => !guild.members.me?.permissions.has(permission.id),
  );
  if (missingPermissions.length > 0) {
    handleMissingPermissions(guild, missingPermissions);
  }

  logger.info("Added to new guild", {
    name: guild.name,
    memberCount: guild.memberCount,
    createdChannel,
    createdRole,
    missingPermissions: missingPermissions.map((permission) => permission.name),
  });
}

function handleMissingPermissions(
  guild: Guild,
  missingPermissions: { name: string }[],
) {
  const defaultGuildChannelId =
    guild.widgetChannelId ||
    guild.rulesChannelId ||
    guild.publicUpdatesChannelId ||
    guild.systemChannelId ||
    guild.safetyAlertsChannelId ||
    guild.afkChannelId ||
    guild.channels.cache.first()?.id;
  const guildReference = defaultGuildChannelId
    ? `<#${defaultGuildChannelId}>`
    : `'${guild.name}'`;

  guild.fetchOwner().then((guildOwner) =>
    guildOwner
      .send({
        content: `Hi, I was just added to your server ${guildReference} (by you or another member) but I was not granted some permissions:\n- ${missingPermissions.map((permission) => permission.name).join("\n- ")}\n\nWithout these permissions, I cannot function properly.\n\nFor an easy setup experience, please **kick me** and then add me again.`,
        components: [
          {
            type: 1,
            components: [inviteButton("Add me again")],
          },
        ],
      })
      .catch((error) =>
        logger.error(
          "Failed to send insufficient permissions message to owner",
          error,
        ),
      ),
  );
}
