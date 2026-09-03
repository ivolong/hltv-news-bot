import { REST } from "@discordjs/rest";
import {
  ActivityType,
  ChannelType,
  Collection,
  GuildBasedChannel,
  Role,
  Snowflake,
} from "discord.js";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  CHANNEL_NAME,
  declareSlashCommands,
  getChannel,
  getRole,
  ROLE_NAME,
  setCommands,
  updateActivity,
} from "./bot";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("bot", () => {
  describe("getRole", () => {
    const monitoredRole = { name: ROLE_NAME } as Role;
    const otherRole = { name: "Moderator" } as Role;

    it("monitored role", () => {
      const cache = new Collection<Snowflake, Role>([
        ["1", otherRole],
        ["2", monitoredRole],
      ]);

      expect(getRole(cache)).toBe(monitoredRole);
    });

    it("no available role", () => {
      const cache = new Collection<Snowflake, Role>([["1", otherRole]]);

      expect(getRole(cache)).toBeUndefined();
    });
  });

  describe("getChannel", () => {
    const monitoredChannel = {
      name: CHANNEL_NAME,
      type: ChannelType.GuildText,
    } as GuildBasedChannel;
    const otherChannel = {
      name: "general",
      type: ChannelType.GuildText,
    } as GuildBasedChannel;

    it("monitored channel", () => {
      const cache = new Collection<string, GuildBasedChannel>([
        ["1", otherChannel],
        ["2", monitoredChannel],
      ]);

      expect(getChannel(cache)).toBe(monitoredChannel);
    });

    it("no supported channel", () => {
      const cache = new Collection<string, GuildBasedChannel>([
        ["1", otherChannel],
      ]);

      expect(getChannel(cache)).toBeUndefined();
    });
  });

  describe("updateActivity", () => {
    it("sets the watching presence with the guild count", () => {
      const setPresence = vi.fn();
      const client = {
        user: { setPresence },
        guilds: {
          cache: new Collection([
            ["1", {}],
            ["2", {}],
          ]),
        },
      };

      updateActivity(client as never);

      expect(setPresence).toHaveBeenCalledWith({
        activities: [
          {
            name: "2 servers",
            type: ActivityType.Watching,
            state: "Sending the latest stories to #news-feed",
          },
        ],
      });
    });

    it("does nothing when the client user is unavailable", () => {
      expect(() =>
        updateActivity({
          guilds: { cache: new Collection() },
        } as never),
      ).not.toThrow();
    });
  });

  describe("setCommands", () => {
    it("registers all commands on the client", () => {
      const client = { commands: new Collection() };

      setCommands(client as never);

      expect(client.commands.size).toBe(4);
      expect(client.commands.has("help")).toBe(true);
      expect(client.commands.has("invite")).toBe(true);
      expect(client.commands.has("mute")).toBe(true);
      expect(client.commands.has("notify")).toBe(true);
    });

    it("declares commands when configured", async () => {
      vi.stubEnv("DECLARE_SLASH_COMMANDS", "1");
      vi.stubEnv("DISCORD_CLIENT_TOKEN", "client-token");
      vi.stubEnv("DISCORD_CLIENT_ID", "client-id");
      const put = vi
        .spyOn(REST.prototype, "put")
        .mockResolvedValue({} as never);
      const client = { commands: new Collection() };

      setCommands(client as never);

      expect(put).toHaveBeenCalledOnce();
    });
  });

  describe("declareSlashCommands", () => {
    it("declares commands through the Discord REST API", async () => {
      vi.stubEnv("DISCORD_CLIENT_TOKEN", "client-token");
      vi.stubEnv("DISCORD_CLIENT_ID", "client-id");
      const put = vi
        .spyOn(REST.prototype, "put")
        .mockResolvedValue({} as never);
      const commands = [{ toJSON: () => ({ name: "help" }) }] as never;

      await declareSlashCommands(commands);

      expect(put).toHaveBeenCalledWith("/applications/client-id/commands", {
        body: commands,
      });
    });

    it("handles a REST declaration failure", async () => {
      vi.stubEnv("DISCORD_CLIENT_TOKEN", "client-token");
      vi.stubEnv("DISCORD_CLIENT_ID", "client-id");
      vi.spyOn(REST.prototype, "put").mockRejectedValue(new Error("offline"));

      await expect(declareSlashCommands([])).resolves.toBeUndefined();
    });
  });
});
