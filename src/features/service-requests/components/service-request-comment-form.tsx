import { SendHorizonal } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { z } from 'zod';

import { Form, useZodForm } from '@/components/ui/form';
import { Editor } from '@/components/ui/rich-text-editor';

import { useLoginRedirect } from '@/features/auth';

import { api } from '@/utils/api';

import { cn } from '@/lib/utils';

import { nonEmptyHtmlString } from '@/server/api/validations/base.validations';

import { useCreateServiceRequestComment } from '../services';

const schema = z.object({
  text: nonEmptyHtmlString,
});

export type ServiceRequestCommentFormInput = z.infer<typeof schema>;

const ServiceRequestCommentForm = ({
  serviceRequestSlug,
  className,
}: {
  className?: string;
  serviceRequestSlug: string;
}) => {
  const form = useZodForm({
    schema,
  });

  const { setValue } = form;
  const queryUtils = api.useContext();
  const { requireLogin } = useLoginRedirect({ reason: 'create-comment' });

  const { mutate, isLoading } = useCreateServiceRequestComment({
    onSuccess: async () => {
      setValue('text', '');
      await queryUtils.services.getServiceRequestComments.invalidate({
        serviceRequestSlug,
      });
    },
  });

  const onHandleSubmit = (formData: ServiceRequestCommentFormInput) => {
    requireLogin(() =>
      mutate({
        text: formData?.text,
        serviceRequestSlug,
      })
    );
  };

  return (
    <Form form={form} className={cn('space-y-2', className)}>
      <Controller
        control={form.control}
        name="text"
        render={({ field: { onChange, value }, fieldState }) => {
          return (
            <Editor
              placeholder="Votre commentaire..."
              autoFocus
              required
              disabled={isLoading}
              onSuperEnter={() => form.handleSubmit(onHandleSubmit)()}
              editorSize="md"
              value={value}
              onChange={onChange}
              iconRight={
                <button
                  type="submit"
                  onClick={form.handleSubmit(onHandleSubmit)}
                  disabled={isLoading}
                  className="default__transition flex h-[24px] w-[24px] items-center justify-center rounded-full bg-brand-500/90 p-1 hover:bg-brand-600"
                >
                  <SendHorizonal className="text-white" />
                </button>
              }
            />
          );
        }}
      />
    </Form>
  );
};

export { ServiceRequestCommentForm };
