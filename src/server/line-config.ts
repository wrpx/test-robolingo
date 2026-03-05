import "server-only";

export interface LineConfig {
  channelAccessToken: string;
  lineUserId: string;
}

export function getLineConfig(): LineConfig {
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  const lineUserId = process.env.LINE_USER_ID;

  if (!channelAccessToken || !lineUserId) {
    throw new Error("LINE configuration is incomplete");
  }

  return {
    channelAccessToken,
    lineUserId,
  };
}
