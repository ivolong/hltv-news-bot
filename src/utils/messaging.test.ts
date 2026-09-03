import { ChannelType, Collection } from "discord.js";
import { describe, expect, it, vi } from "vitest";

import { deliverContentToAll, postUpdate } from "./messaging";

function getGuild(
  channel?: Record<string, unknown>,
  role?: Record<string, unknown>,
) {
  return {
    memberCount: 10,
    channels: {
      cache: channel
        ? new Collection([["channel", channel]])
        : new Collection(),
    },
    roles: {
      cache: role ? new Collection([["role", role]]) : new Collection(),
    },
  };
}

describe("messaging", () => {
  it("delivers content to channels and pings the hltv role", async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const channel = { name: "news-feed", type: ChannelType.GuildText, send };
    const role = { name: "hltv", id: "role-id" };
    const client = {
      guilds: { cache: new Collection([["guild", getGuild(channel, role)]]) },
    };
    const message = { content: "New story" };

    await deliverContentToAll(client as never, "News", message);

    expect(send).toHaveBeenCalledWith({
      content: "New story <@&role-id>",
    });
  });

  it("skips guilds without a news channel", async () => {
    const send = vi.fn();
    const client = {
      guilds: {
        cache: new Collection([
          [
            "guild",
            getGuild({ name: "general", type: ChannelType.GuildText, send }),
          ],
        ]),
      },
    };

    await deliverContentToAll(client as never, "News", { content: "Story" });

    expect(send).not.toHaveBeenCalled();
  });

  it("continues after a non-Error send failure", async () => {
    const send = vi.fn().mockRejectedValue("network failure");
    const channel = { name: "news-feed", type: ChannelType.GuildText, send };
    const client = {
      guilds: { cache: new Collection([["guild", getGuild(channel)]]) },
    };

    await expect(
      deliverContentToAll(client as never, "News", { content: "Story" }),
    ).resolves.toBeUndefined();
  });

  it("continues after an Error send failure", async () => {
    const send = vi.fn().mockRejectedValue(new Error("network failure"));
    const channel = { name: "news-feed", type: ChannelType.GuildText, send };
    const client = {
      guilds: { cache: new Collection([["guild", getGuild(channel)]]) },
    };

    await expect(
      deliverContentToAll(client as never, "News", { content: "Story" }),
    ).resolves.toBeUndefined();
  });

  it("posts an update", async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const channel = { name: "news-feed", type: ChannelType.GuildText, send };
    const client = {
      guilds: { cache: new Collection([["guild", getGuild(channel)]]) },
    };

    await postUpdate(client as never, "Update", "Title", "Description");

    expect(send).toHaveBeenCalledWith({
      content: "Update",
      embeds: [{ title: "Title", description: "Description" }],
    });
  });
});
