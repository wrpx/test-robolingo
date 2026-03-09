import "server-only";

import { messagingApi } from "@line/bot-sdk";
import { getLineConfig } from "@/server/line-config";

export function getLineMessagingClient() {
  const { channelAccessToken } = getLineConfig();

  return new messagingApi.MessagingApiClient({
    channelAccessToken,
  });
}
