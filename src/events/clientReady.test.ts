import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import clientReady, {
  getRemainingTimeForInterval,
  sleep,
  TIME_SECOND,
} from "./clientReady";

const mocks = vi.hoisted(() => ({
  rssChecker: vi.fn(),
  setCommands: vi.fn(),
  updateActivity: vi.fn(),
  updateStats: vi.fn(),
}));

vi.mock("../utils/rss", () => ({ rssChecker: mocks.rssChecker }));
vi.mock("../utils/bot", () => ({
  setCommands: mocks.setCommands,
  updateActivity: mocks.updateActivity,
}));
vi.mock("../utils/stats", () => ({ updateStats: mocks.updateStats }));

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

afterEach(() => {
  vi.useRealTimers();
});

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

  describe("sleep", () => {
    it("resolves after the requested delay", async () => {
      let resolved = false;
      const sleeping = sleep(100).then(() => {
        resolved = true;
      });

      await Promise.resolve();
      expect(resolved).toBe(false);

      vi.advanceTimersByTime(100);
      await sleeping;

      expect(resolved).toBe(true);
    });
  });

  describe("loop", () => {
    it("checks the RSS endpoint and continues after an error", async () => {
      mocks.rssChecker.mockRejectedValueOnce(new Error("offline"));
      const client = {
        isReady: vi.fn().mockReturnValueOnce(true).mockReturnValueOnce(false),
        guilds: { cache: { size: 2 } },
      };

      const ready = clientReady(client as never);
      await Promise.resolve();
      vi.advanceTimersByTime(10_000);
      await ready;

      expect(mocks.setCommands).toHaveBeenCalledWith(client);
      expect(mocks.rssChecker).toHaveBeenCalledWith(
        "https://www.hltv.org/rss/news",
        client,
      );
      expect(mocks.updateActivity).not.toHaveBeenCalled();

      vi.advanceTimersByTime(600 * TIME_SECOND);
      expect(mocks.updateStats).toHaveBeenCalledWith(2);
    });

    it("uses a configured RSS endpoint", async () => {
      vi.stubEnv("HLTV_ENDPOINT", "https://example.test");
      mocks.rssChecker.mockResolvedValueOnce(undefined);
      const client = {
        isReady: vi.fn().mockReturnValueOnce(true).mockReturnValueOnce(false),
        guilds: { cache: { size: 0 } },
      };

      const ready = clientReady(client as never);
      await Promise.resolve();
      vi.advanceTimersByTime(10_000);
      await ready;

      expect(mocks.rssChecker).toHaveBeenCalledWith(
        "https://example.test/rss/news",
        client,
      );
    });
  });
});
