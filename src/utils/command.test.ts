import { ApplicationCommand, Collection, Snowflake } from "discord.js";
import { describe, expect, it } from "vitest";

import { getSlashCommandString } from "./command";

const someCommand = { id: "1", name: "some" } as ApplicationCommand;
const otherCommand = { id: "2", name: "other" } as ApplicationCommand;

describe("command", () => {
  describe("getSlashCommandString", () => {
    it("successful full fetch", () => {
      const commands = new Collection<Snowflake, ApplicationCommand>([
        [someCommand.id, someCommand],
        [otherCommand.id, otherCommand],
      ]);

      const requestedCommands = [someCommand.name];
      const expectedOutput = [`</${someCommand.name}:${someCommand.id}>`];

      expect(getSlashCommandString(requestedCommands, commands)).toStrictEqual(
        expectedOutput,
      );
    });

    it("command returned without id", () => {
      const commands = new Collection<Snowflake, ApplicationCommand>([]);

      const requestedCommands = [someCommand.name];
      const expectedOutput = [`\`/${someCommand.name}\``];

      expect(getSlashCommandString(requestedCommands, commands)).toStrictEqual(
        expectedOutput,
      );
    });

    it("no commands", () => {
      const commands = new Collection<Snowflake, ApplicationCommand>([
        [someCommand.id, someCommand],
        [otherCommand.id, otherCommand],
      ]);

      expect(getSlashCommandString([], commands)).toStrictEqual([]);
    });
  });
});
