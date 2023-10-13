import axios from 'axios';
import { File, Plus, SendHorizonal } from 'lucide-react';
import React, { RefObject } from 'react';
import { Controller } from 'react-hook-form';
import { z } from 'zod';

import { EmojiPicker } from '@/components/emoji-picker';
import { Form, useZodForm } from '@/components/ui/form';
import { useModal } from '@/components/ui/modal';
import { Popover } from '@/components/ui/popover';
import { TextareaAutosize } from '@/components/ui/textarea-autosize';
import { toast } from '@/components/ui/toast';
import { DropzoneUpload, useUpload } from '@/components/ui/uploadthing';

import { isArrayOfFile } from '@/utils/type-guards';

import { QS } from '@/lib/qs';

const chatFormSchema = z.object({
  content: z.string().min(1),
});

const imageUploadFormSchema = z.object({
  content: z.string().optional().nullable(),
  fileUrl: z.array(z.unknown()).min(1, 'Vous devez fournir un fichier.'),
});

type ImageUploadFormInput = z.infer<typeof imageUploadFormSchema>;

type ConversationFooterProps = React.PropsWithChildren<{
  name: string;
  socketUrl: string;
  query: Record<string, string>;
  bottomRef: RefObject<HTMLDivElement>
}>;

const ConversationFileUploadForm = ({
  socketUrl,
  onAfterSubmitFileUpload,
  query,
}: Omit<ConversationFooterProps, 'name' | 'bottomRef'> & { onAfterSubmitFileUpload: () => void }) => {
  const form = useZodForm({
    schema: imageUploadFormSchema,
    defaultValues: {
      fileUrl: [],
    },
  });


  const { control, formState } = form;

  const isLoading = form.formState.isSubmitting;
  const watchedContent = form.watch('content');

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

  const onHandleSubmit = async (formData: ImageUploadFormInput) => {
    try {
      const fileArray = formData.fileUrl;
      const files = isArrayOfFile(fileArray)
        ? await startUpload(fileArray)
        : [];

      const url = QS.stringifyUrl(socketUrl, query);
      await axios.post(url, {
        content: formData?.content,
        fileUrl: files && files[0]?.url,
      });
      form.reset();
      onAfterSubmitFileUpload();
    } catch (e) {
      toast({
        variant: 'danger',
        title: "Une erreur s'est produite",
        description:
          "Une erreur s'est produite lors de l'envoi de votre message.",
      });
    }
  };

  return (
    <Form form={form} onSubmit={onHandleSubmit}>
      <div>
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
                isLoading={isUploading || isLoading}
                icon={<File className="h-10 w-10" />}
                className="h-[300px] text-gray-600"
                label="Ajouter un fichier"
                value={fileValue}
                onChange={onChange}
              />
            );
          }}
        />
      </div>
      <div className="relative">
        <TextareaAutosize
          {...form.register('content')}
          disabled={isLoading || isUploading}
          placeholder={`Ajouter un message (Optionnel) ...`}
          className="bottom-0 rounded-md border-none bg-zinc-200/80 py-3.5 pl-4 pr-[71px] text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-x-2 px-2">
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
  );
};

const ConversationChatFooter = ({
  socketUrl,
  query,
  name,
  bottomRef
}: ConversationFooterProps) => {
  const { open: isOpen, onOpenChange } = useModal();
  const form = useZodForm({
    schema: chatFormSchema,
  });

  const watchedContent = form.watch('content');
  const isLoading = form.formState.isSubmitting;

  const onScrollDown = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }, 150);
  }

  const onAfterSubmitFileUpload = () => {
    onOpenChange(false)
    onScrollDown()
  }

  //TODO: Refactor this service api request to the service folder
  const onHandleSumit = async (formData: unknown) => {
    try {
      const url = QS.stringifyUrl(socketUrl, query);
      await axios.post(url, formData);
      form.reset();
      onScrollDown()
    } catch (e) {
      console.error(e);
      toast({
        variant: 'danger',
        title: "Une erreur s'est produite",
        description:
          "Une erreur s'est produite lors de l'envoi de votre message",
      });
    }
  };

  return (
    <Form form={form} onSubmit={onHandleSumit}>
      <div className="relative border-t border-gray-200 p-4 shadow-sm">
        <Popover modal onOpenChange={onOpenChange} open={isOpen}>
          <Popover.Trigger asChild>
            <button
              type="button"
              disabled={isLoading}
              className="default__transition absolute bottom-7 left-8 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-zinc-500/90 p-1 hover:bg-zinc-600"
            >
              <Plus className="text-white" />
            </button>
          </Popover.Trigger>
          <Popover.Content side="top" className="mb-3 lg:min-w-[400px]">
            <ConversationFileUploadForm
              onAfterSubmitFileUpload={onAfterSubmitFileUpload}
              socketUrl={socketUrl}
              query={query}
            />
          </Popover.Content>
        </Popover>

        <TextareaAutosize
          {...form.register('content')}
          disabled={isLoading}
          required
          placeholder={`Envoyer un message à ${name}`}
          className="bottom-0 rounded-md border-none bg-zinc-200/80 py-3.5 pl-12 pr-[70px] text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <div className="absolute bottom-7 right-8 flex items-center gap-x-2 px-2">
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
  );
};

export { ConversationChatFooter };
