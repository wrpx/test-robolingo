import "server-only";

import { messagingApi } from "@line/bot-sdk";
import { getLineConfig } from "@/server/line-config";

export async function sendLineTextMessage(text: string) {
  const { channelAccessToken, lineUserId } = getLineConfig();

  const client = new messagingApi.MessagingApiClient({
    channelAccessToken,
  });

  await client.pushMessage({
    to: lineUserId,
    messages: [{ type: "text", text }],
  });
}
