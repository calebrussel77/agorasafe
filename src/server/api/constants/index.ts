export const DIRECT_MESSAGES_CHUNK = 10;

export const CONVERSATIONS_CHUNK = 10;

export const socketEventsKey = {
  directMessageCreate: (conversationId: string) =>
    `direct-message:create:${conversationId}`,
  directMessageUpdate: (conversationId: string) =>
    `direct-message:update:${conversationId}`,
  newUserConnected: () => `new:user:connected`,
};
