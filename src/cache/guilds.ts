type GuildInfo = {
  channelId: string;
  roleId: string | undefined;
  memberCount: number;
};

export const guildCache = new Map<string, GuildInfo>([]);
