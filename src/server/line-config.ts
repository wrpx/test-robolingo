import "server-only";

export interface LineConfig {
  channelAccessToken: string;
  defaultTargetId?: string;
}

export interface LineWebhookConfig {
  channelSecret: string;
}

export function getLineConfig(): LineConfig {
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

  if (!channelAccessToken) {
    throw new Error("LINE configuration is incomplete");
  }

  return {
    channelAccessToken,
    defaultTargetId: getLineDefaultTargetId(),
  };
}

export function getLineDefaultTargetId() {
  const lineUserId = process.env.LINE_USER_ID?.trim();
  return lineUserId || undefined;
}

export function getLineWebhookConfig(): LineWebhookConfig {
  const channelSecret = process.env.LINE_CHANNEL_SECRET;

  if (!channelSecret) {
    throw new Error("LINE webhook configuration is incomplete");
  }

  return {
    channelSecret,
  };
}
