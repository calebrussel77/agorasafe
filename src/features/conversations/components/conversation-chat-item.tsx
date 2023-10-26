import axios from 'axios';
import {
  Edit,
  LinkIcon,
  SendHorizonal,
  ShieldAlert,
  Trash,
} from 'lucide-react';
import { type Session } from 'next-auth';
import { useRouter } from 'next/router';
import qs from 'query-string';
import { useEffect, useState } from 'react';
import { useKeyPressEvent } from 'react-use';
import * as z from 'zod';

import { ActionTooltip } from '@/components/action-tooltip';
import { EmojiPicker } from '@/components/emoji-picker';
import { Field } from '@/components/ui/field';
import { getFileIcon, getImageUrl } from '@/components/ui/file-upload';
import { Form, useZodForm } from '@/components/ui/form';
import { Image } from '@/components/ui/image';
import { closeModal, openConfirmModal } from '@/components/ui/modal';
import { TextareaAutosize } from '@/components/ui/textarea-autosize';
import { Typography } from '@/components/ui/typography';
import { UserAvatar } from '@/components/user-avatar';

import { cn } from '@/lib/utils';

import { type SimpleProfile } from '@/server/api/modules/profiles';

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
  const handleKeyDown = () => setIsEditing(false);

  useKeyPressEvent('Escape', handleKeyDown);

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

  const onDelete = async () => {
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
  };

  const onOpenDeleteModal = () => {
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
  };

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

  return (
    <div className="group relative flex w-full items-center p-4 transition hover:bg-black/5">
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
              className="flex w-full items-start gap-x-2 space-y-0 pt-2"
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
                    className="w-full rounded-md border-none bg-zinc-200/80 px-4 py-3 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </Field>
                <div className="absolute right-4 top-2 z-20 flex items-center gap-x-2">
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
      {canDeleteMessage && !isEditing && (
        <div className="absolute -top-2 right-5 hidden items-center gap-x-2 rounded-sm border bg-white p-1 group-hover:flex dark:bg-zinc-800">
          {canEditMessage && (
            <ActionTooltip label="Modifier">
              <Edit
                onClick={() => setIsEditing(true)}
                className="ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
              />
            </ActionTooltip>
          )}

          <ActionTooltip label="Supprimer" asChild={false}>
            <Trash
              onClick={onOpenDeleteModal}
              className="ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
