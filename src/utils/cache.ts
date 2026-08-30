import { HltvArticle } from "../events/newArticle";

type Cache = {
  latestArticle?: HltvArticle;
};

const cache: Cache = {};

export function getLatestArticle() {
  return cache.latestArticle;
}

export function setLatestArticle(article: HltvArticle) {
  cache.latestArticle = article;
}
