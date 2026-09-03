import { Collection } from "discord.js";
import { describe, expect, it, vi } from "vitest";

import notify from "./notify";

function getInteraction(overrides: Record<string, unknown> = {}) {
  return {
    inCachedGuild: vi.fn().mockReturnValue(true),
    guild: {
      roles: {
        cache: new Collection([["role", { name: "hltv", id: "role-id" }]]),
      },
    },
    member: { roles: { add: vi.fn().mockResolvedValue(undefined) } },
    editReply: vi.fn(),
    ...overrides,
  };
}

describe("notify", () => {
  it("rejects use outside a server", async () => {
    const interaction = getInteraction({
      inCachedGuild: vi.fn().mockReturnValue(false),
    });

    await notify.execute(interaction as never);

    expect(interaction.editReply).toHaveBeenCalledWith({
      content: "This command must be used in a server channel.",
    });
  });

  it("reports when the notification role is missing", async () => {
    const interaction = getInteraction({
      guild: { roles: { cache: new Collection() } },
    });

    await notify.execute(interaction as never);

    expect(interaction.editReply).toHaveBeenCalledWith({
      content:
        "There is no `@hltv` role in this server for me to assign (you won't get pinged).",
    });
  });

  it("adds the notification role", async () => {
    const interaction = getInteraction();

    await notify.execute(interaction as never);

    expect(interaction.member.roles.add).toHaveBeenCalledWith({
      name: "hltv",
      id: "role-id",
    });
    expect(interaction.editReply).toHaveBeenCalledWith({
      content: "Done, role added (you'll get a @ping).",
    });
  });

  it("reports a role assignment failure", async () => {
    const add = vi.fn().mockRejectedValue(new Error("forbidden"));
    const interaction = getInteraction({ member: { roles: { add } } });

    await notify.execute(interaction as never);

    expect(interaction.editReply).toHaveBeenCalledWith(
      "Sorry, I wasn't able to add you to the <@&role-id> role. Please try again or contact the server administrator.",
    );
  });
});
