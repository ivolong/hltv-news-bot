import { DMChannel, GuildChannel } from "discord.js";

import { CHANNEL_NAME } from "../utils/bot";
import { logger } from "../utils/logging";

export default async function channelUpdate(
  oldChannel: DMChannel | GuildChannel,
  newChannel: DMChannel | GuildChannel,
) {
  if (
    oldChannel instanceof DMChannel ||
    newChannel instanceof DMChannel ||
    !newChannel.isSendable()
  )
    return;

  if (oldChannel.name == CHANNEL_NAME && newChannel.name !== CHANNEL_NAME) {
    logger.info("Supported channel was renamed");

    newChannel.send(
      `I see the \`#${CHANNEL_NAME}\` channel has been renamed. Please change the name back to \`#${CHANNEL_NAME}\` if you wish to continue receiving HLTV articles. I can only send HLTV articles to a channel named \`#${CHANNEL_NAME}\`, sorry.`,
    );
  }

  if (newChannel.name == CHANNEL_NAME && oldChannel.name !== CHANNEL_NAME) {
    logger.info("Unknown channel was renamed");

    newChannel.send(
      `I see this channel has been renamed \`#${CHANNEL_NAME}\`. I will post HLTV articles in here.`,
    );
  }
}
