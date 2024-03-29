import { nonEmptyHtmlString } from '@/validations';
import { produce } from 'immer';
import { SendHorizonal } from 'lucide-react';
import { useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { z } from 'zod';

import { Form, useZodForm } from '@/components/ui/form';
import {
  Editor,
  type EditorCommandsRef,
} from '@/components/ui/rich-text-editor';

import { getLoginLink, useLoginRedirect } from '@/features/auth';

import { api } from '@/utils/api';
import { makeRandomId } from '@/utils/misc';

import { cn } from '@/lib/utils';

import { type CommentConnectorInput } from '@/server/api/modules/comments';
import { type SimpleProfile } from '@/server/api/modules/profiles';

import { useCurrentUser } from '@/hooks/use-current-user';

import { AutoAnimate } from '../ui/auto-animate';
import { Button } from '../ui/button';
import { SectionMessage } from '../ui/section-message';
import { toast } from '../ui/toast';
import { UserAvatar } from '../user';

const schema = z.object({
  text: nonEmptyHtmlString,
});

export type CommentFormInput = z.infer<typeof schema>;

const CommentForm = ({
  className,
  entityId,
  entityType,
  comment,
  onCancel,
  autoFocus,
  replyTo,
  disabled,
}: {
  className?: string;
  comment?: { id: string; text: string };
  onCancel?: () => void;
  autoFocus?: boolean;
  replyTo?: SimpleProfile;
  disabled?: boolean;
} & CommentConnectorInput) => {
  const editorRef = useRef<EditorCommandsRef | null>(null);

  const queryUtils = api.useContext();
  const { profile } = useCurrentUser();
  const [isFocused, setIsFocused] = useState(autoFocus || false);
  const defaultValues = { ...comment, entityId, entityType };
  const form = useZodForm({
    schema,
    defaultValues,
    mode: 'onChange',
  });

  const commentMutation = api.comments.upsert.useMutation({
    onMutate(variables) {
      if (variables.id) {
        queryUtils.comments.getInfinite.setInfiniteData(
          {
            entityId,
            entityType,
          },
          produce(old => {
            if (!old) return;

            for (const page of old.pages) {
              for (const comment of page.comments) {
                if (comment.id === variables.id) {
                  comment.text = variables.text;
                }
              }
            }
          })
        );
      } else {
        queryUtils.comments.getInfinite.setInfiniteData(
          {
            entityId,
            entityType,
          },
          produce(old => {
            if (!old || !profile) return;

            for (const page of old.pages) {
              page.comments.unshift({
                id: makeRandomId(),
                author: profile,
                text: variables.text,
                createdAt: new Date(),
              });
            }
          })
        );
        queryUtils.comments.getCount.setData(
          { entityId, entityType },
          (old = 0) => old + 1
        );
      }
      handleCancel();
    },
    onError(error) {
      toast({
        variant: 'danger',
        title:
          "Une erreur s'est produite lors de l'envoi de votre commentaire.",
      });
    },
    async onSettled(data, error, variables, context) {
      await queryUtils.comments.getCount.invalidate({ entityId, entityType });
      await queryUtils.comments.getInfinite.invalidate({
        entityId,
        entityType,
      });
    },
  });

  const handleCancel = () => {
    if (!autoFocus) setIsFocused(false);
    onCancel?.();
    form.reset();
  };

  const onHandleSubmit = (formData: CommentFormInput) => {
    commentMutation.mutate({
      ...comment,
      ...formData,
      entityId,
      entityType,
    });
  };

  if (profile?.isMuted) {
    return (
      <SectionMessage
        appareance="warning"
        title="Vous ne pouvez pas Commenter"
        description="Vous ne pouvez pas commenter car vous avez été mis en sourdine."
      />
    );
  }

  if (!profile) {
    return (
      <SectionMessage
        hasCloseButton={false}
        appareance="info"
        title="Connectez-vous pour commenter"
        description="Accéder à votre compte pour laisser votre commentaire"
        actions={
          <Button
            size="sm"
            variant="secondary"
            href={getLoginLink({
              reason: 'create-comment',
            })}
          >
            Connexion
          </Button>
        }
      />
    );
  }

  return (
    <Form form={form} onSubmit={onHandleSubmit} className={cn(className)}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex w-full flex-1 items-start gap-3">
          <UserAvatar profile={profile} size="md" />
          <Controller
            control={form.control}
            name="text"
            render={({ field: { onChange, value }, fieldState }) => {
              return (
                <Editor
                  innerRef={editorRef}
                  placeholder="Entrez votre commentaire..."
                  autoFocus={isFocused}
                  required
                  disabled={commentMutation.isLoading || disabled}
                  onFocus={
                    !autoFocus && !disabled
                      ? () => setIsFocused(true)
                      : undefined
                  }
                  onSuperEnter={() => form.handleSubmit(onHandleSubmit)()}
                  editorSize="md"
                  withEmoji={isFocused}
                  value={value}
                  onChange={onChange}
                />
              );
            }}
          />
        </div>
        <AutoAnimate className="ml-auto flex flex-nowrap items-center justify-end gap-3 overflow-hidden">
          {isFocused && (
            <>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Annuler
              </Button>
              <Button
                type="submit"
                size="sm"
                isLoading={commentMutation.isLoading}
                disabled={!form.formState.isDirty}
              >
                Commenter
              </Button>
            </>
          )}
        </AutoAnimate>
      </div>
    </Form>
  );
};

export { CommentForm };
