import { afterEach, describe, expect, it, vi } from "vitest";

import { updateStats } from "./stats";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("stats", () => {
  it("nothing configured posts nothing", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);

    await updateStats(3);

    expect(fetch).not.toHaveBeenCalled();
  });

  it("guild count posted to every provider", async () => {
    vi.stubEnv("DISCORD_CLIENT_ID", "client-id");
    vi.stubEnv("TOPGG_CLIENT_TOKEN", "top-token");
    vi.stubEnv("DISCORD_BOTS_GG_TOKEN", "bots-token");
    vi.stubEnv("BOTLIST_ME_CLIENT_TOKEN", "botlist-token");
    vi.stubEnv("DISCORD_LIST_CLIENT_TOKEN", "list-token");
    const fetch = vi.fn().mockReturnValue({ ok: true });
    vi.stubGlobal("fetch", fetch);

    await updateStats(3);

    expect(fetch).toHaveBeenCalledTimes(4);
    expect(fetch).toHaveBeenNthCalledWith(
      1,
      "https://top.gg/api/bots/client-id/stats",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ server_count: 3 }),
      }),
    );
    expect(fetch).toHaveBeenNthCalledWith(
      2,
      "https://discord.bots.gg/api/v1/bots/client-id/stats",
      expect.objectContaining({ body: JSON.stringify({ guildCount: 3 }) }),
    );
    expect(fetch).toHaveBeenNthCalledWith(
      3,
      "https://api.botlist.me/api/v1/bots/client-id/stats",
      expect.objectContaining({ body: JSON.stringify({ server_count: 3 }) }),
    );
    expect(fetch).toHaveBeenNthCalledWith(
      4,
      "https://api.discordlist.gg/v0/bots/client-id/guilds",
      expect.objectContaining({ body: JSON.stringify({ count: 3 }) }),
    );
  });

  it("failed request with unsuccessful response", async () => {
    vi.stubEnv("TOPGG_CLIENT_TOKEN", "top-token");
    vi.stubEnv("DISCORD_CLIENT_ID", "client-id");
    const response = { ok: false, text: vi.fn().mockResolvedValue("bad") };
    const fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockReturnValueOnce(response);
    vi.stubGlobal("fetch", fetch);

    await updateStats(3);
    await updateStats(3);

    expect(response.text).toHaveBeenCalledOnce();
  });
});
