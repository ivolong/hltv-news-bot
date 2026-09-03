import { describe, expect, it, vi } from "vitest";

import { deliverContentToAll } from "../utils/messaging";
import newArticle from "./newArticle";

vi.mock("../utils/messaging", () => ({
  deliverContentToAll: vi.fn(),
}));

describe("newArticle", () => {
  it("delivers an article", () => {
    const article = {
      title: "A new story",
      link: "https://hltv.org/news/1",
      pubDate: new Date(),
      content: "Story content",
      contentSnippet: "Story content",
      guid: "article-1",
      isoDate: "2024-01-01T00:00:00.000Z",
      media: { $: { url: "https://hltv.org/image.jpg" } },
    };

    newArticle({} as never, article);

    expect(deliverContentToAll).toHaveBeenCalledWith(
      {},
      "A new story",
      expect.objectContaining({
        content: "A new story https://hltv.org/news/1",
        embeds: [
          expect.objectContaining({
            title: "A new story",
            description: "Story content",
            url: "https://hltv.org/news/1",
            timestamp: "2024-01-01T00:00:00.000Z",
          }),
        ],
        components: [
          expect.objectContaining({
            type: 1,
            components: expect.arrayContaining([
              expect.objectContaining({ label: "Read" }),
              expect.objectContaining({ label: "View comments" }),
            ]),
          }),
        ],
      }),
      "article-1",
    );
  });
});
