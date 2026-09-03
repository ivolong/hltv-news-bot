import { Collection } from "discord.js";
import { describe, expect, it, vi } from "vitest";

import mute from "./mute";

function getInteraction(overrides: Record<string, unknown> = {}) {
  return {
    inCachedGuild: vi.fn().mockReturnValue(true),
    guild: {
      roles: {
        cache: new Collection([["role", { name: "hltv", id: "role-id" }]]),
      },
    },
    member: { roles: { remove: vi.fn().mockResolvedValue(undefined) } },
    editReply: vi.fn(),
    ...overrides,
  };
}

describe("mute", () => {
  it("rejects use outside a server", async () => {
    const interaction = getInteraction({
      inCachedGuild: vi.fn().mockReturnValue(false),
    });

    await mute.execute(interaction as never);

    expect(interaction.editReply).toHaveBeenCalledWith({
      content: "This command must be used in a server channel.",
    });
  });

  it("reports when the notification role is missing", async () => {
    const interaction = getInteraction({
      guild: { roles: { cache: new Collection() } },
    });

    await mute.execute(interaction as never);

    expect(interaction.editReply).toHaveBeenCalledWith({
      content:
        "There is no `@hltv` role in this server for me to remove (you won't get pinged).",
    });
  });

  it("removes the notification role", async () => {
    const interaction = getInteraction();

    await mute.execute(interaction as never);

    expect(interaction.member.roles.remove).toHaveBeenCalledWith({
      name: "hltv",
      id: "role-id",
    });
    expect(interaction.editReply).toHaveBeenCalledWith({
      content: "Done, role removed (you won't get pinged).",
    });
  });

  it("reports a role removal failure", async () => {
    const remove = vi.fn().mockRejectedValue(new Error("forbidden"));
    const interaction = getInteraction({ member: { roles: { remove } } });

    await mute.execute(interaction as never);

    expect(interaction.editReply).toHaveBeenCalledWith(
      "Sorry, I wasn't able to remove you from the <@&role-id> role. Please try again or contact a server administrator.",
    );
  });
});
