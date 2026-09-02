import { describe, expect, it } from "vitest";

import { getRemainingTimeForInterval, TIME_SECOND } from "./clientReady";

describe("clientReady", () => {
  describe("getRemainingTimeForInterval", () => {
    it("normal time waited returns normal remainder of interval", () => {
      const started = new Date("January 1, 2000 00:00:00");
      const fiveSecondsAfterStart = new Date("January 1, 2000 00:00:05");
      const tenSecondInterval = 10 * TIME_SECOND;
      const fiveSecondRemainder = 5 * TIME_SECOND;

      expect(
        getRemainingTimeForInterval(
          started,
          tenSecondInterval,
          fiveSecondsAfterStart,
        ),
      ).toBe(fiveSecondRemainder);
    });

    it("normal time waited returns normal remainder of interval", () => {
      const started = new Date("January 1, 2000 00:00:05");
      const fiveSecondsAfterStart = new Date("January 1, 2000 00:00:00");
      const tenSecondInterval = 10 * TIME_SECOND;

      expect(
        getRemainingTimeForInterval(
          started,
          tenSecondInterval,
          fiveSecondsAfterStart,
        ),
      ).toBe(0);
    });

    it("negative wait time returns no interval", () => {
      expect(getRemainingTimeForInterval(new Date(), -1)).toBe(0);
    });

    it("no wait time returns no interval", () => {
      expect(getRemainingTimeForInterval(new Date(), 0)).toBe(0);
    });

    it("no time waited returns interval", () => {
      const now = new Date();
      expect(getRemainingTimeForInterval(now, 2, now)).toBe(2);
    });
  });
});
