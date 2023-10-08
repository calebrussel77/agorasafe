export const DIRECT_MESSAGES_CHUNK = 10;

export const CONVERSATIONS_CHUNK = 10;

export const socketEventsKey = {
  createDirectMessage: (conversationId: string) =>
    `chat:${conversationId}:direct-messages`,
  updateDirectMessage: (conversationId: string) =>
    `chat:${conversationId}:direct-messages:update`,
};
