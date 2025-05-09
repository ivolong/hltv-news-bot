import { Client } from "discord.js";

const botUtils = require("../utils/bot.js");
import { logger } from "../utils/logging.js";

module.exports = (client: Client) => {
  logger.info("Online");

  botUtils.setCommands(client);

  setInterval(botUtils.updateActivity, 60e3, client);

  setInterval(
    botUtils.rssChecker,
    5e3,
    "hltv",
    "https://www.hltv.org/rss/news",
    client,
  );
};
