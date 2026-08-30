import { describe, expect, it } from "vitest";

import { getLatestArticle, setLatestArticle } from "./cache";

describe("cache", () => {
  describe("getLatestArticle", () => {
    it("uninitialised cache is empty", () => {
      expect(getLatestArticle()).toBe(undefined);
    });
  });

  describe("setLatestArticle", () => {
    it("updating cache", () => {
      const cacheValueToSet = {
        title: "",
        link: "",
        pubDate: "",
        media: { $: { url: "" } },
        content: "",
        contentSnippet: "",
        guid: "",
        isoDate: "",
      };
      expect(getLatestArticle()).not.toStrictEqual(cacheValueToSet);

      setLatestArticle(cacheValueToSet);
      expect(getLatestArticle()).toStrictEqual(cacheValueToSet);
    });
  });
});
