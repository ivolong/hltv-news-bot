import { describe, expect, it, vi } from "vitest";

import invite from "./invite";

describe("invite", () => {
  it("replies with the help command and invite button", async () => {
    const editReply = vi.fn();
    const fetch = vi.fn().mockResolvedValue({
      find: () => ({ id: "help-id", name: "help" }),
    });
    const interaction = {
      client: { application: { commands: { fetch } } },
      editReply,
    };

    await invite.execute(interaction as never);

    expect(fetch).toHaveBeenCalledOnce();
    expect(editReply).toHaveBeenCalledWith({
      content:
        "Add me to your server and follow the required steps. Check out </help:help-id> for assistance.",
      components: [
        {
          type: 1,
          components: [
            expect.objectContaining({
              label: "Add to your server",
            }),
          ],
        },
      ],
    });
  });

  it("uses a fallback when help is not registered", async () => {
    const editReply = vi.fn();
    const interaction = {
      client: {
        application: { commands: { fetch: vi.fn().mockResolvedValue([]) } },
      },
      editReply,
    };

    await invite.execute(interaction as never);

    expect(editReply).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.stringContaining("Check out `/help` for assistance."),
      }),
    );
  });
});
