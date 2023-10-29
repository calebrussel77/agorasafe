import axios from 'axios';
import {
  Edit,
  LinkIcon,
  MoreVertical,
  SendHorizonal,
  ShieldAlert,
  Trash,
  TrashIcon,
  X,
} from 'lucide-react';
import { type Session } from 'next-auth';
import { useRouter } from 'next/router';
import qs from 'query-string';
import { cloneElement, useCallback, useEffect, useMemo, useState } from 'react';
import * as z from 'zod';

import { ActionTooltip } from '@/components/action-tooltip';
import { EmojiPicker } from '@/components/emoji-picker';
import { Button } from '@/components/ui/button';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { Field } from '@/components/ui/field';
import { getFileIcon, getImageUrl } from '@/components/ui/file-upload';
import { Form, useZodForm } from '@/components/ui/form';
import { Image } from '@/components/ui/image';
import { Inline } from '@/components/ui/inline';
import { closeModal, openConfirmModal } from '@/components/ui/modal';
import { TextareaAutosize } from '@/components/ui/textarea-autosize';
import { Typography } from '@/components/ui/typography';
import { UserAvatar } from '@/components/user-avatar';

import { cn } from '@/lib/utils';

import { type SimpleProfile } from '@/server/api/modules/profiles';

import { getHotkeyHandler, useHotkeys } from '@/hooks/use-hot-keys';

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

const roleIconMap = {
  MEMBER: null,
  ADMIN: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

type FormDataInputs = z.infer<typeof formSchema>;

const modalId = 'delete-conversation-chat-item';

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

  const onSubmit = async (values: FormDataInputs) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);

      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onHandleSubmit = (event: React.KeyboardEvent<HTMLElement>) => {
    void form.handleSubmit(onSubmit)(event);
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
          <span className="font-semibold">{content}</span>" ?
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

  const watchedContent = form.watch('content');

  const isAdmin = session?.user?.role === 'ADMIN';
  const isOwner = connectedProfile?.id === profile?.id;
  const canDeleteMessage = !isDeleted && (isAdmin || isOwner);
  const canEditMessage = !isDeleted && isOwner;
  const Icon = fileUrl ? getFileIcon(fileUrl) : LinkIcon;
  const imageUrl = fileUrl && getImageUrl(fileUrl);

  const messageOptions = useMemo(() => {
    return [
      {
        label: 'Supprimer',
        canView: canDeleteMessage,
        onClick: onOpenDeleteModal,
        icon: <TrashIcon />,
      },
      {
        label: 'Modifier',
        canView: canEditMessage,
        onClick: () => setIsEditing(true),
        icon: <Edit />,
      },
    ];
  }, [canEditMessage, onOpenDeleteModal, canDeleteMessage]);

  return (
    <div className="group relative flex w-full items-start p-4 transition hover:bg-black/5">
      <div className="group flex w-full items-start gap-x-2">
        <div
          onClick={onProfileClick}
          className="cursor-pointer transition hover:drop-shadow-md"
        >
          <UserAvatar
            src={profile.avatar as string}
            alt={profile?.name}
            type={profile?.type}
          />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-2">
            <Inline>
              <div className="flex items-center">
                <p
                  onClick={onProfileClick}
                  className="cursor-pointer text-sm font-semibold hover:underline"
                >
                  {profile.name}
                </p>
                <ActionTooltip label={session?.user?.role}>
                  {roleIconMap[session?.user?.role || 'MEMBER']}
                </ActionTooltip>
              </div>

              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {timestamp}
              </span>
            </Inline>
          </div>
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
            <p
              className={cn(
                'text-sm text-zinc-600',
                isDeleted && 'mt-1 italic text-zinc-500',
                fileUrl && 'mt-2'
              )}
            >
              {content}
              {isUpdated && !isDeleted && (
                <span className="mx-2 text-[10px] text-zinc-500">
                  (Modifié)
                </span>
              )}
            </p>
          )}
          {isEditing && (
            <Form
              form={form}
              onSubmit={onSubmit}
              className="flex w-full items-start gap-x-2 space-y-0 pt-1"
              onKeyDown={getHotkeyHandler([
                ['Enter', onHandleSubmit as never],
                ['Escape', onHandleEscape as never],
              ])}
            >
              <div className="relative w-full flex-1">
                <Field
                  className="w-full"
                  hint={`Appuyer sur "escape" ou "esc" pour annuler.`}
                >
                  <TextareaAutosize
                    {...form.register('content')}
                    disabled={isLoading}
                    placeholder="Modifier le message"
                    className="w-full rounded-md border-none bg-zinc-200/80 py-3 pl-3 pr-[73px] text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </Field>
                <div className="absolute bottom-8 right-4 z-20 flex items-center gap-x-2">
                  <EmojiPicker
                    onChange={emoji =>
                      form.setValue('content', `${watchedContent}${emoji}`)
                    }
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="default__transition flex h-[24px] w-[24px] items-center justify-center rounded-full bg-brand-500/90 p-1 hover:bg-brand-600"
                  >
                    <SendHorizonal className="text-white" />
                  </button>
                </div>
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
        <div className="">
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
