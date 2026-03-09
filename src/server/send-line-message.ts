import "server-only";

import { getLineMessagingClient } from "@/server/line-client";

export async function sendLineTextMessage(text: string, to: string) {
  const client = getLineMessagingClient();

  await client.pushMessage({
    to,
    messages: [{ type: "text", text }],
  });
}
