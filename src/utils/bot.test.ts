import {
  ChannelType,
  Collection,
  GuildBasedChannel,
  Role,
  Snowflake,
} from "discord.js";
import { describe, expect, it } from "vitest";

import { CHANNEL_NAME, getChannel, getRole, ROLE_NAME } from "./bot";

describe("bot", () => {
  describe("getRole", () => {
    const monitoredRole = { name: ROLE_NAME + "1" } as Role;
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
});
