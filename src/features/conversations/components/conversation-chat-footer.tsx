import { nonEmptyHtmlString } from '@/validations';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { produce } from 'immer';
import { File, Plus, SendHorizonal } from 'lucide-react';
import React, { type RefObject } from 'react';
import { Controller } from 'react-hook-form';
import { z } from 'zod';

import { Form, useZodForm } from '@/components/ui/form';
import {
  type ContextModalProps,
  ModalFooter,
  ModalHeader,
  ModalMain,
  openContextModal,
} from '@/components/ui/modal';
import { Editor } from '@/components/ui/rich-text-editor';
import { toast } from '@/components/ui/toast';
import { DropzoneUpload, useUpload } from '@/components/ui/uploadthing';

import { api } from '@/utils/api';
import { makeRandomId } from '@/utils/misc';
import { isArrayOfFile } from '@/utils/type-guards';

import { QS } from '@/lib/qs';

import { useIsMobile } from '@/hooks/use-breakpoints';
import { useCurrentUser } from '@/hooks/use-current-user';
import { getHotkeyHandler } from '@/hooks/use-hot-keys';

import { type MessageWithWithProfile } from '../types';

const chatFormSchema = z.object({
  content: nonEmptyHtmlString,
});

const imageUploadFormSchema = z.object({
  content: z.string().or(z.undefined()).nullish(),
  fileUrl: z.array(z.unknown()).min(1, 'Vous devez fournir un fichier.'),
});

type ImageUploadFormInput = z.infer<typeof imageUploadFormSchema>;

type ChatFormInput = z.infer<typeof chatFormSchema>;

type ConversationFooterProps = React.PropsWithChildren<{
  name: string;
  socketUrl: string;
  query: Record<'conversationId', string>;
  bottomRef: RefObject<HTMLDivElement>;
}>;

const createConversationMessage = async ({
  url,
  formData,
}: {
  url: string;
  formData: ChatFormInput;
}) => {
  return axios.post<MessageWithWithProfile>(url, formData);
};

const createConversationMessageWithFile = async ({
  url,
  formData,
}: {
  url: string;
  formData: { content?: string; fileUrl: string };
}) => {
  return axios.post<{ content?: string; fileUrl: string }>(url, formData);
};

const ConversationFileUploadFormModal = ({
  context,
  id,
  innerProps: { socketUrl, handleScrollDown, query },
}: ContextModalProps<
  Prettify<
    Omit<ConversationFooterProps, 'name' | 'bottomRef'> & {
      handleScrollDown: () => void;
    }
  >
>) => {
  const form = useZodForm({
    schema: imageUploadFormSchema,
    defaultValues: {
      fileUrl: [],
    },
  });

  const { control } = form;
  const queryUtils = api.useContext();
  const { profile } = useCurrentUser();

  const { startUpload, isUploading } = useUpload({
    endpoint: 'conversationFiles',
    onError(error) {
      toast({
        variant: 'danger',
        title: "Une erreur s'est produite",
        description: "Une erreur s'est produite lors de l'upload du fichier.",
      });
    },
  });

  const createMessage = useMutation({
    mutationFn: createConversationMessageWithFile,
    async onMutate({ formData: { content, fileUrl } }) {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryUtils.messages.getDirectMessages.cancel();
      await queryUtils.conversations.getConversations.cancel();

      if (!profile) return;

      //Update the UI by adding the new message on the messages list
      queryUtils.messages.getDirectMessages.setInfiniteData(
        { conversationId: query.conversationId },
        produce(oldData => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return oldData;
          }

          for (const page of oldData.pages)
            page.directMessages.push({
              content: content ?? null,
              createdAt: new Date(),
              conversationId: query.conversationId,
              id: makeRandomId(),
              profileId: profile.id,
              fileUrl,
              deletedAt: null,
              updatedAt: new Date(),
              profile: profile as never,
            });
        })
      );

      //Update the UI by adding the new message on the conversations list (lastMessage)
      queryUtils.conversations.getConversations.setInfiniteData(
        { profileId: profile?.id },
        produce(oldData => {
          if (!oldData) {
            return oldData;
          }
          for (const page of oldData.pages) {
            for (const item of page.conversations) {
              item.directMessages[0] = {
                content: content ?? null,
                createdAt: new Date(),
                conversationId: query.conversationId,
                id: makeRandomId(),
                profileId: profile?.id,
                fileUrl,
                deletedAt: null,
                updatedAt: new Date(),
              };
            }
          }
        })
      );

      //Reset the form and scroll down
      form.reset();
      handleScrollDown();
      context.closeModal(id);
    },
    onError(error, variables, context) {
      console.error(error);
      toast({
        variant: 'danger',
        title: "Une erreur s'est produite",
        description:
          "Une erreur s'est produite lors de l'envoi de votre message. Rechargez votre page et reessayez.",
      });
    },
    // Always refetch after error or success:
    onSettled: async () => {
      await queryUtils.conversations.getConversations.invalidate({
        profileId: profile?.id as string,
      });
      await queryUtils.messages.getDirectMessages.invalidate({
        conversationId: query.conversationId,
      });
    },
  });

  const onSubmit = async (formData: ImageUploadFormInput) => {
    const fileArray = formData.fileUrl;
    const files = isArrayOfFile(fileArray) ? await startUpload(fileArray) : [];
    const url = QS.stringifyUrl(socketUrl, query);
    createMessage.mutate({
      url,
      formData: {
        content: formData?.content ?? undefined,
        fileUrl: (files && files[0]?.url) as string,
      },
    });
  };

  const onHandleKeyDown = (event: React.KeyboardEvent) => {
    event.preventDefault();
    void form.handleSubmit(onSubmit)(event);
  };

  return (
    <>
      <ModalHeader title="Ajouter un fichier" />
      <ModalMain>
        <Form
          form={form}
          onSubmit={onSubmit}
          onKeyDown={getHotkeyHandler([['Enter', onHandleKeyDown as never]])}
          className="h-full"
        >
          <div className="relative h-full flex-1 md:h-[300px]">
            <Controller
              control={control}
              name={`fileUrl`}
              render={({ field: { onChange, value }, fieldState }) => {
                const fileValue = value as File[];

                return (
                  <DropzoneUpload
                    hint="Le poids max. d'un fichier est de 4MB"
                    error={fieldState?.error?.message}
                    fileTypes={['image', 'pdf', 'text']}
                    isLoading={isUploading || createMessage?.isLoading}
                    icon={<File className="h-10 w-10 text-gray-600" />}
                    className="absolute inset-y-0 h-full"
                    label="Sélectionnez ou déposez votre fichier içi !"
                    value={fileValue}
                    onChange={onChange}
                  />
                );
              }}
            />
          </div>
        </Form>
      </ModalMain>
      <ModalFooter className="relative w-full pb-4">
        <Controller
          control={form.control}
          name="content"
          render={({ field: { onChange, value } }) => {
            return (
              <Editor
                placeholder={`Ajouter un message...`}
                disabled={createMessage?.isLoading || isUploading}
                editorSize="sm"
                value={value || ''}
                onChange={onChange}
                onSuperEnter={() => form.handleSubmit(onSubmit)()}
                className="rounded-lg border-none bg-gray-100 pr-20"
                iconRight={
                  <button
                    type="submit"
                    onClick={() => form.handleSubmit(onSubmit)()}
                    disabled={createMessage?.isLoading || isUploading}
                    className="default__transition flex h-[24px] w-[24px] items-center justify-center rounded-full bg-brand-500/90 p-1 hover:bg-brand-600"
                  >
                    <SendHorizonal className="text-white" />
                  </button>
                }
              />
            );
          }}
        />
      </ModalFooter>
    </>
  );
};

const ConversationChatFooter = ({
  socketUrl,
  query,
  name,
  bottomRef,
}: ConversationFooterProps) => {
  const form = useZodForm({
    schema: chatFormSchema,
  });

  const isMobile = useIsMobile();
  const { profile } = useCurrentUser();
  const queryUtils = api.useContext();

  const handleScrollDown = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }, 150);
  };

  const createMessage = useMutation({
    mutationFn: createConversationMessage,
    async onMutate({ formData: { content } }) {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryUtils.messages.getDirectMessages.cancel();
      await queryUtils.conversations.getConversations.cancel();

      if (!profile) return;

      //Update the UI by adding the new message on the messages list
      queryUtils.messages.getDirectMessages.setInfiniteData(
        { conversationId: query.conversationId },
        produce(oldData => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return oldData;
          }

          for (const page of oldData.pages)
            page.directMessages.push({
              content,
              createdAt: new Date(),
              conversationId: query.conversationId,
              id: makeRandomId(),
              profileId: profile.id,
              fileUrl: null,
              deletedAt: null,
              updatedAt: new Date(),
              profile: profile as never,
            });
        })
      );

      //Update the UI by adding the new message on the conversations list (lastMessage)
      queryUtils.conversations.getConversations.setInfiniteData(
        { profileId: profile?.id },
        produce(oldData => {
          if (!oldData) {
            return oldData;
          }
          for (const page of oldData.pages) {
            for (const item of page.conversations) {
              item.directMessages[0] = {
                content,
                createdAt: new Date(),
                conversationId: query.conversationId,
                id: makeRandomId(),
                profileId: profile?.id,
                fileUrl: null,
                deletedAt: null,
                updatedAt: new Date(),
              };
            }
          }
        })
      );

      //Reset the form and scroll down
      form.reset();
      handleScrollDown();
    },
    onError(error, variables, context) {
      console.error(error);
      toast({
        variant: 'danger',
        title: "Une erreur s'est produite",
        description:
          "Une erreur s'est produite lors de l'envoi de votre message. Rechargez votre page et reessayez.",
      });
    },
    // Always refetch after error or success:
    onSettled: async () => {
      await queryUtils.conversations.getConversations.invalidate({
        profileId: profile?.id as string,
      });
      await queryUtils.messages.getDirectMessages.invalidate({
        conversationId: query.conversationId,
      });
    },
  });

  const onSubmit = (formData: ChatFormInput) => {
    const url = QS.stringifyUrl(socketUrl, query);
    createMessage.mutate({ url, formData });
  };

  const onOpenConversationFileUploadModal = () => {
    openContextModal({
      isFullScreen: isMobile,
      modal: 'conversationFileUploadForm',
      innerProps: {
        query,
        socketUrl,
        handleScrollDown,
      },
    });
  };

  return (
    <Form form={form}>
      <div className="relative border-t border-gray-200 px-4 py-2 shadow-sm">
        <Controller
          control={form.control}
          name="content"
          render={({ field: { onChange, value }, fieldState }) => {
            return (
              <Editor
                placeholder={`Envoyer un message à ${name}`}
                // When we have only one input of type RTE, we need to invoke the onSuperEnter event to submit the form,
                // without adding extra space.
                onSuperEnter={() => form.handleSubmit(onSubmit)()}
                editorSize="sm"
                value={value || ''}
                onChange={onChange}
                className="rounded-lg border-none bg-gray-100 pr-20"
                iconRight={
                  <button
                    type="submit"
                    onClick={form.handleSubmit(onSubmit)}
                    className="default__transition flex h-[24px] w-[24px] items-center justify-center rounded-full bg-brand-500/90 p-1 hover:bg-brand-600"
                  >
                    <SendHorizonal className="text-white" />
                  </button>
                }
                iconLeft={
                  <button
                    type="button"
                    onClick={onOpenConversationFileUploadModal}
                    disabled={createMessage.isLoading}
                    className="default__transition flex h-[24px] w-[24px] items-center justify-center rounded-full bg-gray-500/90 p-1 hover:bg-gray-600"
                  >
                    <Plus className="text-white" />
                  </button>
                }
              />
            );
          }}
        />
      </div>
    </Form>
  );
};

export { ConversationChatFooter, ConversationFileUploadFormModal };
