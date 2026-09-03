import { ChannelType, Collection, PermissionFlagsBits } from "discord.js";
import { describe, expect, it, vi } from "vitest";

import help from "./help";

function getInteraction(guild: Record<string, unknown>) {
  return {
    client: {
      application: {
        commands: {
          fetch: vi.fn().mockResolvedValue(new Collection()),
        },
      },
    },
    guild,
    editReply: vi.fn(),
  };
}

function getGuild(overrides: Record<string, unknown> = {}) {
  const member = {
    permissions: { has: vi.fn().mockReturnValue(true) },
  };
  const channel = {
    id: "channel-id",
    name: "news-feed",
    type: ChannelType.GuildText,
    permissionsFor: vi.fn().mockReturnValue({
      has: vi.fn().mockReturnValue(true),
    }),
  };
  const role = { id: "role-id", name: "hltv" };

  return {
    members: { me: member },
    channels: { cache: new Collection([[channel.id, channel]]) },
    roles: { cache: new Collection([[role.id, role]]) },
    ...overrides,
  };
}

describe("help", () => {
  it("explains setup when the bot member is unavailable", async () => {
    const interaction = getInteraction({ members: { me: undefined } });

    await help.execute(interaction as never);

    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("needs a channel called `#news-feed`"),
      }),
    );
  });

  it("reports a fully configured server", async () => {
    const interaction = getInteraction(getGuild());

    await help.execute(interaction as never);

    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("You are good to go."),
      }),
    );
  });

  it("reports missing channel and role", async () => {
    const guild = getGuild({
      channels: { cache: new Collection() },
      roles: { cache: new Collection() },
    });
    const interaction = getInteraction(guild);

    await help.execute(interaction as never);

    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("I don't see `#news-feed`"),
      }),
    );
    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("I don't see an `@hltv` role"),
      }),
    );
  });

  it("reports channel and role permission problems", async () => {
    const guild = getGuild();
    const channel = guild.channels.cache.first()!;
    channel.permissionsFor = vi.fn().mockReturnValue({
      has: vi.fn().mockReturnValue(false),
    });
    guild.members.me!.permissions.has = vi
      .fn()
      .mockImplementation(
        (permission) => permission !== PermissionFlagsBits.MentionEveryone,
      );
    const interaction = getInteraction(guild);

    await help.execute(interaction as never);

    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("I can't send messages"),
      }),
    );
    expect(interaction.editReply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("I can't ping <@&role-id>"),
      }),
    );
  });
});
