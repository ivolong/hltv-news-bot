import { describe, expect, it } from "vitest";

import { isNewArticle, parseItem } from "./rss";

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
  describe("parseItem", () => {
    it("empty items return nothing", () => {
      expect(parseItem()).toBe(undefined);
      expect(parseItem(undefined)).toBe(undefined);
      expect(parseItem(null)).toBe(undefined);
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
