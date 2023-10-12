import { useSocketStore } from '@/stores/socket-store';
import { DirectMessage } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { api } from '@/utils/api';

import { SimpleProfile } from '@/server/api/modules/profiles';

type ChatSocketProps = {
  createEventKey: string;
  updateEventKey: string;
  conversationId: string;
};

type MessageWithWithProfile = DirectMessage & {
  profile: SimpleProfile;
};

export const useConversationChatSocket = ({
  createEventKey,
  updateEventKey,
  conversationId,
}: ChatSocketProps) => {
  const { socket } = useSocketStore();
  const queryUtils = api.useContext();

  useEffect(() => {
    if (!socket) {
      return;
    }

    //TODO: Give the possibility to update the last message in the conversations list after update or create
    
    socket.on(updateEventKey, async (message: MessageWithWithProfile) => {
      await queryUtils.messages.getDirectMessages.cancel();
      await queryUtils.conversations.getConversations.cancel();

      //Update the last message on the list of conversations
      queryUtils.conversations.getConversations.setInfiniteData(
        { profileId: message.profileId },
        oldData => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return oldData;
          }

          const newData = oldData.pages.map(page => {
            return {
              ...page,
              conversations: page.conversations.map(el => {
                if (el?.id === message.conversationId) {
                  return { ...el, directMessages: [message] };
                }
                return el;
              }),
            };
          });

          return { ...oldData, pages: newData };
        }
      );

      //Update the message on the conversation
      queryUtils.messages.getDirectMessages.setInfiniteData(
        { conversationId },
        oldData => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return oldData;
          }

          const newData = oldData.pages.map(page => {
            return {
              ...page,
              directMessages: page.directMessages.map(directMessage => {
                if (directMessage.id === message.id) {
                  return message;
                }
                return directMessage;
              }),
            };
          });

          return {
            ...oldData,
            pages: newData,
          };
        }
      );
    });

    socket.on(createEventKey, async (message: MessageWithWithProfile) => {
      await queryUtils.messages.getDirectMessages.cancel();
      await queryUtils.conversations.getConversations.cancel();

      //Update the last message on the list of conversations
      queryUtils.conversations.getConversations.setInfiniteData(
        { profileId: message.profileId },
        oldData => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return oldData;
          }

          const newData = oldData.pages.map(page => {
            return {
              ...page,
              conversations: page.conversations.map(el => {
                if (el?.id === message.conversationId) {
                  return { ...el, directMessages: [message] };
                }
                return el;
              }),
            };
          });

          return { ...oldData, pages: newData };
        }
      );

      queryUtils.messages.getDirectMessages.setInfiniteData(
        { conversationId },
        oldData => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return {
              pages: [{ directMessages: [message], nextCursor: undefined }],
              pageParams: [],
            };
          }

          const newData = [...oldData.pages];

          newData[0] = {
            ...newData[0],
            nextCursor: newData[0]?.nextCursor,
            directMessages: [
              message,
              ...(newData[0]?.directMessages as MessageWithWithProfile[]),
            ] as MessageWithWithProfile[],
          };

          return {
            ...oldData,
            pages: newData,
          };
        }
      );
    });

    return () => {
      socket.off(createEventKey);
      socket.off(updateEventKey);
    };
  }, [
    conversationId,
    createEventKey,
    queryUtils.conversations.getConversations,
    queryUtils.messages.getDirectMessages,
    socket,
    updateEventKey,
  ]);
};
