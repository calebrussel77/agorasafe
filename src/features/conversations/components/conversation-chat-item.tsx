/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { produce } from 'immer';
import {
  Edit,
  LinkIcon,
  MoreVertical,
  SendHorizonal,
  TrashIcon,
  X,
} from 'lucide-react';
import { type Session } from 'next-auth';
import { useRouter } from 'next/router';
import qs from 'query-string';
import { cloneElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import * as z from 'zod';

import { RenderHtml } from '@/components/render-html';
import { Button } from '@/components/ui/button';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { getFileIcon, getImageUrl } from '@/components/ui/file-upload';
import { Form, useZodForm } from '@/components/ui/form';
import { Image } from '@/components/ui/image';
import { Inline } from '@/components/ui/inline';
import { closeModal, openConfirmModal } from '@/components/ui/modal';
import { Editor } from '@/components/ui/rich-text-editor';
import { toast } from '@/components/ui/toast';
import { Typography } from '@/components/ui/typography';
import { UserAvatar, UserName } from '@/components/user';

import { api } from '@/utils/api';
import { removeTags } from '@/utils/strings';

import { cn } from '@/lib/utils';

import { type SimpleProfile } from '@/server/api/modules/profiles';

import { getHotkeyHandler } from '@/hooks/use-hot-keys';

interface ConversationChatItemProps {
  id: string;
  content: string;
  profile: SimpleProfile;
  session: Session | null;
  timestamp: string;
  fileUrl: string | null;
  isDeleted: boolean;
  connectedProfile: SimpleProfile;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const formSchema = z.object({
  content: z.string().min(1),
});

type FormDataInputs = z.infer<typeof formSchema>;

const modalId = 'delete-conversation-chat-item';

const updateConversationMessage = async ({
  url,
  formData,
}: {
  url: string;
  formData: FormDataInputs;
}) => {
  return axios.patch(url, formData);
};

export const ConversationChatItem = ({
  id,
  content,
  profile,
  timestamp,
  fileUrl,
  isDeleted,
  connectedProfile,
  session,
  isUpdated,
  socketUrl,
  socketQuery,
}: ConversationChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const router = useRouter();
  const onHandleEscape = () => setIsEditing(false);
  const queryUtils = api.useContext();

  const updateMessage = useMutation({
    mutationFn: updateConversationMessage,
    async onMutate({ formData: { content } }) {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryUtils.messages.getDirectMessages.cancel();
      await queryUtils.conversations.getConversations.cancel();

      //Update the UI by adding the new message on the messages list
      queryUtils.messages.getDirectMessages.setInfiniteData(
        { conversationId: socketQuery.conversationId as string },
        produce(oldData => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return oldData;
          }

          for (const page of oldData.pages) {
            const index = page.directMessages.findIndex(item => item.id === id);
            if (index !== -1) {
              if (page.directMessages[index]) {
                //@ts-ignore
                page.directMessages[index].content = content;
                //@ts-ignore
                page.directMessages[index].updatedAt = new Date();
              }
            }
          }
        })
      );

      //Update the UI by adding the new message on the conversations list (lastMessage)
      queryUtils.conversations.getConversations.setInfiniteData(
        { profileId: connectedProfile?.id },
        produce(oldData => {
          if (!oldData) {
            return oldData;
          }
          for (const page of oldData.pages) {
            for (const item of page.conversations) {
              const directMessage = item.directMessages.find(
                item => item.id === id
              );
              if (directMessage) {
                directMessage.content = content;
                directMessage.updatedAt = new Date();
              }
            }
          }
        })
      );

      //Reset the form and set editing mode
      form.reset();
      setIsEditing(false);
    },
    onError(error) {
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
        profileId: connectedProfile?.id,
      });
      await queryUtils.messages.getDirectMessages.invalidate({
        conversationId: socketQuery?.conversationId,
      });
    },
  });

  const onProfileClick = () => {
    if (profile.id === connectedProfile.id) {
      return;
    }
    void router.push(`/u/${profile?.slug}`);
  };

  const form = useZodForm({
    schema: formSchema,
    defaultValues: {
      content: content,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = (formData: FormDataInputs) => {
    const url = qs.stringifyUrl({
      url: `${socketUrl}/${id}`,
      query: socketQuery,
    });
    updateMessage.mutate({ url, formData });
  };

  const onDelete = useCallback(async () => {
    setIsLoadingDelete(true);
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });
      await axios.delete(url);
      closeModal(modalId);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingDelete(false);
    }
  }, [id, socketQuery, socketUrl]);

  const onOpenDeleteModal = useCallback(() => {
    openConfirmModal({
      title: 'Supprimer le message',
      modalId,
      children: (
        <Typography>
          Êtes-vous sûr de vouloir supprimer le message "
          <span className="font-semibold">{removeTags(content)}</span>" ?
        </Typography>
      ),
      className: 'max-w-xl',
      confirmProps: { isLoading: isLoadingDelete },
      onConfirm: onDelete,
    });
  }, [content, isLoadingDelete, onDelete]);

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content, form]);

  const isAdmin = session?.user?.role === 'ADMIN';
  const isOwner = connectedProfile?.id === profile?.id;
  const canDeleteMessage = !isDeleted && (isAdmin || isOwner);
  const canEditMessage = !isDeleted && isOwner;
  const Icon = fileUrl ? getFileIcon(fileUrl) : LinkIcon;
  const imageUrl = fileUrl && getImageUrl(fileUrl);

  const messageOptions = useMemo(() => {
    return [
      {
        label: 'Modifier',
        canView: canEditMessage,
        onClick: () => setIsEditing(true),
        icon: <Edit />,
      },
      {
        label: 'Supprimer',
        canView: canDeleteMessage,
        onClick: onOpenDeleteModal,
        icon: <TrashIcon />,
      },
    ];
  }, [canEditMessage, onOpenDeleteModal, canDeleteMessage]);

  return (
    <div
      className={cn(
        'group relative flex w-full items-start p-4 transition',
        !isEditing && 'hover:bg-black/5'
      )}
    >
      <div className="group flex w-full items-start gap-x-3">
        <div
          onClick={onProfileClick}
          className="cursor-pointer transition hover:drop-shadow-md"
        >
          <UserAvatar profile={profile} />
        </div>
        <div className="w-full flex-1">
          <Inline>
            <UserName
              profile={profile}
              onClick={onProfileClick}
              className="text-sm"
              withProfileBadgeInitial
            />
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
            {isUpdated && !isDeleted && (
              <span className="text-[10px] text-zinc-500">(Modifié)</span>
            )}
          </Inline>
          {imageUrl && (
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative mt-2 flex aspect-square h-48 w-48 items-center overflow-hidden rounded-md border bg-secondary"
            >
              <Image
                src={imageUrl}
                alt={content}
                className="h-48 w-48 object-cover"
              />
            </a>
          )}
          {!imageUrl && fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative mt-2 flex aspect-square h-48 w-48 items-center overflow-hidden rounded-md border bg-secondary"
            >
              <Icon className="h-48 w-48 fill-brand-200 stroke-brand-400" />
            </a>
          )}
          {!isEditing && (
            <>
              <RenderHtml
                truncate
                lines={8}
                className={cn(
                  'mt-0.5 text-sm',
                  isDeleted && 'italic text-gray-500',
                  fileUrl && 'mt-1.5'
                )}
                html={content}
              />
            </>
          )}
          {isEditing && (
            <Form
              form={form}
              className="flex w-full items-start gap-x-3 space-y-0 pt-1"
              onKeyDown={getHotkeyHandler([
                ['Escape', onHandleEscape as never],
              ])}
            >
              <div className="relative w-full flex-1">
                <Controller
                  control={form.control}
                  name="content"
                  render={({ field: { onChange, value }, fieldState }) => {
                    return (
                      <Editor
                        placeholder={`Ecrivez votre message...`}
                        disabled={isLoading}
                        // When we have only one input of type RTE, we need to invoke the onSuperEnter event to submit the form,
                        // without adding extra space.
                        autoFocus={isEditing}
                        onSuperEnter={() => form.handleSubmit(onSubmit)()}
                        hint={`Appuyer sur "escape" ou "esc" pour annuler.`}
                        editorSize="sm"
                        value={value || ''}
                        onChange={onChange}
                        className="rounded-lg border-none bg-gray-100 pr-20"
                        iconRight={
                          <button
                            type="submit"
                            disabled={isLoading}
                            onClick={() => form.handleSubmit(onSubmit)()}
                            className="default__transition flex h-[24px] w-[24px] items-center justify-center rounded-full bg-brand-500/90 p-1 hover:bg-brand-600"
                          >
                            <SendHorizonal className="text-white" />
                          </button>
                        }
                      />
                    );
                  }}
                />
              </div>
            </Form>
          )}
        </div>
      </div>
      {isEditing && (
        <Button
          size="xs"
          variant="ghost"
          className="absolute right-2 top-3 flex lg:hidden"
          onClick={onHandleEscape}
        >
          <X className="h-4 w-4 text-red-500" />
        </Button>
      )}
      {canDeleteMessage && !isEditing && (
        <div>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button
                size="xs"
                variant="ghost"
                className="absolute right-2 top-3"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="min-w-[180px]">
              <div className="flex flex-col space-y-1">
                {messageOptions
                  .filter(el => el.canView)
                  .map(({ label, onClick, icon }) => (
                    <DropdownMenu.Item
                      key={label}
                      className="default__transition flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm text-gray-900 hover:bg-gray-100"
                      onClick={onClick}
                    >
                      {cloneElement(icon, {
                        className: 'h-4 w-4 md:h-5 md:w-5',
                      })}
                      {label}
                    </DropdownMenu.Item>
                  ))}
              </div>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};
