import "server-only";

import type { WebhookRequestBody } from "@line/bot-sdk";
import type { ConversationType } from "@/features/chat/conversation";
import type { ChatSender } from "@/features/chat/message";
import { getLineMessagingClient } from "@/server/line-client";

type EventSource = WebhookRequestBody["events"][number]["source"];

type ConversationDescriptor = {
  id: string;
  type: ConversationType;
  replyTargetId?: string;
  canSend: boolean;
  defaultTitle: string;
};

type ConversationPresentation = {
  title?: string;
  imageUrl?: string | null;
};

function formatFallbackTitle(type: ConversationType, id: string) {
  const shortId = id.slice(-6);

  switch (type) {
    case "user":
      return `LINE user ${shortId}`;
    case "group":
      return `LINE group ${shortId}`;
    case "room":
      return `LINE room ${shortId}`;
    default:
      return "Configured target";
  }
}

export function getConversationDescriptor(
  source: EventSource,
  fallbackId: string,
): ConversationDescriptor {
  switch (source.type) {
    case "user": {
      const id = source.userId ?? `unknown-user-${fallbackId}`;

      return {
        id,
        type: source.userId ? "user" : "unknown",
        replyTargetId: source.userId,
        canSend: Boolean(source.userId),
        defaultTitle: formatFallbackTitle(source.userId ? "user" : "unknown", id),
      };
    }
    case "group":
      return {
        id: source.groupId,
        type: "group",
        replyTargetId: source.groupId,
        canSend: true,
        defaultTitle: formatFallbackTitle("group", source.groupId),
      };
    case "room":
      return {
        id: source.roomId,
        type: "room",
        replyTargetId: source.roomId,
        canSend: true,
        defaultTitle: formatFallbackTitle("room", source.roomId),
      };
    default:
      return {
        id: `unknown-${fallbackId}`,
        type: "unknown",
        canSend: false,
        defaultTitle: "Unknown chat",
      };
  }
}

export async function getSenderProfile(source: EventSource): Promise<ChatSender | undefined> {
  if (!source.userId) {
    return undefined;
  }

  const client = getLineMessagingClient();

  try {
    switch (source.type) {
      case "user": {
        const profile = await client.getProfile(source.userId);

        return {
          lineUserId: profile.userId,
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl ?? null,
        };
      }
      case "group": {
        const profile = await client.getGroupMemberProfile(source.groupId, source.userId);

        return {
          lineUserId: profile.userId,
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl ?? null,
        };
      }
      case "room": {
        const profile = await client.getRoomMemberProfile(source.roomId, source.userId);

        return {
          lineUserId: profile.userId,
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl ?? null,
        };
      }
      default:
        return undefined;
    }
  } catch (error) {
    console.error("Failed to load LINE sender profile:", error);
    return undefined;
  }
}

export async function getConversationPresentation(
  source: EventSource,
  descriptor: ConversationDescriptor,
  sender?: ChatSender,
): Promise<ConversationPresentation> {
  if (source.type === "user") {
    return {
      title: sender?.displayName ?? descriptor.defaultTitle,
      imageUrl: sender?.pictureUrl ?? null,
    };
  }

  if (source.type === "group") {
    const client = getLineMessagingClient();

    try {
      const summary = await client.getGroupSummary(source.groupId);

      return {
        title: summary.groupName ?? descriptor.defaultTitle,
        imageUrl: summary.pictureUrl ?? null,
      };
    } catch (error) {
      console.error("Failed to load LINE group summary:", error);
    }
  }

  return {
    title: descriptor.defaultTitle,
  };
}
