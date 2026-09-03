import Parser from "rss-parser";
import { describe, expect, it, vi } from "vitest";

import { EventNewArticle } from "../events/newArticle";
import { getLatestArticle, setLatestArticle } from "./cache";
import { isNewArticle, parseItem, rssChecker } from "./rss";

type BaseItem = {
  title?: string;
  link?: string;
  mediaUrl?: string;
  content?: string;
  contentSnippet?: string;
  isoDate?: string;
};

function getHltvItem({
  title = "Title",
  link = "https://hltv.org",
  pubDate = new Date().toISOString(),
  mediaUrl = "https://hltv.org",
  content = "Content",
  contentSnippet = "Content",
  guid = Math.random().toString(),
  isoDate = new Date().toISOString(),
}: BaseItem & {
  pubDate?: string | null;
  guid?: string | null;
} = {}) {
  return {
    title,
    link,
    pubDate,
    media: { $: { url: mediaUrl } },
    content,
    contentSnippet,
    guid,
    isoDate,
  };
}
function getHltvArticle({
  title = "Title",
  link = "https://hltv.org",
  pubDate = new Date(),
  mediaUrl = "https://hltv.org",
  content = "Content",
  contentSnippet = "Content",
  guid = Math.random().toString(),
  isoDate = new Date().toISOString(),
}: BaseItem & {
  pubDate?: Date;
  guid?: string;
} = {}) {
  return {
    title,
    link,
    pubDate,
    media: { $: { url: mediaUrl } },
    content,
    contentSnippet,
    guid,
    isoDate,
  };
}

describe("rss", () => {
  describe("rssChecker", () => {
    it("populates cache for the first time without emitting", async () => {
      expect(getLatestArticle()).toBe(undefined);

      const firstItem = getHltvItem({
        guid: "current",
        pubDate: "January 2, 2000",
      });

      vi.spyOn(Parser.prototype, "parseURL").mockResolvedValueOnce({
        items: [firstItem],
      });
      const client = { emit: vi.fn() };

      await rssChecker("https://hltv.org/rss/news", client as never);

      expect(getLatestArticle()).toStrictEqual(parseItem(firstItem));
      expect(client.emit).not.toHaveBeenCalled();
    });

    it("ignores an invalid feed item", async () => {
      vi.spyOn(Parser.prototype, "parseURL").mockResolvedValueOnce({
        items: [{}],
      });
      const client = { emit: vi.fn() };

      await rssChecker("https://hltv.org/rss/news", client as never);

      expect(client.emit).not.toHaveBeenCalled();
    });

    it("ignores a stale feed item", async () => {
      const currentArticle = getHltvArticle({
        guid: "current",
        pubDate: new Date("January 2, 2000"),
      });
      setLatestArticle(currentArticle);
      vi.spyOn(Parser.prototype, "parseURL").mockResolvedValueOnce({
        items: [
          getHltvItem({
            guid: "old",
            pubDate: "January 1, 2000",
          }),
        ],
      });
      const client = { emit: vi.fn() };

      await rssChecker("https://hltv.org/rss/news", client as never);

      expect(getLatestArticle()).toStrictEqual(currentArticle);
      expect(client.emit).not.toHaveBeenCalled();
    });

    it("updates the cache and emits a new article", async () => {
      setLatestArticle(
        getHltvArticle({
          guid: "current",
          pubDate: new Date("January 1, 2000"),
        }),
      );
      const item = getHltvItem({
        guid: "new",
        pubDate: "January 2, 2000",
      });
      vi.spyOn(Parser.prototype, "parseURL").mockResolvedValueOnce({
        items: [item],
      });
      const client = { emit: vi.fn() };

      await rssChecker("https://hltv.org/rss/news", client as never);

      const article = getLatestArticle();
      expect(getLatestArticle()).toStrictEqual(parseItem(item));
      expect(client.emit).toHaveBeenCalledWith(EventNewArticle, article);
    });
  });

  describe("parseItem", () => {
    it("empty items return nothing", () => {
      expect(parseItem()).toBe(undefined);
      expect(parseItem(undefined)).toBe(undefined);
      expect(parseItem(null)).toBe(undefined);
      expect(parseItem(1)).toBe(undefined);
      expect(parseItem({})).toBe(undefined);
      expect(parseItem({ something: "anything" })).toBe(undefined);
    });

    it("invalid pubDate", () => {
      expect(parseItem(getHltvItem({ pubDate: "" }))).toBe(undefined);
      expect(parseItem(getHltvItem({ pubDate: null }))).toBe(undefined);
      expect(parseItem(getHltvItem({ pubDate: "bad date" }))).toBe(undefined);
    });

    it("invalid guid", () => {
      expect(parseItem(getHltvItem({ guid: null }))).toBe(undefined);
      expect(parseItem(getHltvItem({ guid: "" }))).toBe(undefined);
    });

    it("valid", () => {
      const now = new Date().toISOString();
      const actualItem = getHltvItem({ guid: "1", pubDate: now });
      const parsedItem = getHltvArticle({ guid: "1", pubDate: new Date(now) });
      expect(parseItem(actualItem)).toStrictEqual(parsedItem);
    });
  });

  describe("isNewArticle", () => {
    it("identical articles ignored", () => {
      const article = getHltvArticle();
      expect(isNewArticle(article, article)).toBe(false);
    });

    it("older article ignored", () => {
      const currentArticle = getHltvArticle({
        pubDate: new Date("Thu, 31 Dec 2000 23:59:59 GMT"),
      });
      const newerArticleOlderDate = getHltvArticle({
        pubDate: new Date("Thu, 31 Dec 1999 23:59:59 GMT"),
      });
      expect(isNewArticle(currentArticle, newerArticleOlderDate)).toBe(false);
    });

    it("same guid ignored", () => {
      const currentArticle = getHltvArticle({
        guid: "1",
        pubDate: new Date("Thu, 31 Dec 2000 23:59:59 GMT"),
      });
      const newerArticle = getHltvArticle({
        guid: "1",
        pubDate: new Date("Thu, 31 Dec 2001 23:59:59 GMT"),
      });
      expect(isNewArticle(currentArticle, newerArticle)).toBe(false);
    });

    it("new article", () => {
      const currentArticle = getHltvArticle({
        pubDate: new Date("Thu, 31 Dec 2000 23:59:59 GMT"),
      });
      const newerArticle = getHltvArticle({
        pubDate: new Date("Thu, 31 Dec 2001 23:59:59 GMT"),
      });
      expect(isNewArticle(currentArticle, newerArticle)).toBe(true);
    });
  });
});
