import { type TRPCClientErrorLike } from '@trpc/client';
import { useRouter } from 'next/router';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SectionMessage } from '@/components/ui/section-message';
import { Textarea } from '@/components/ui/textarea';

import { type AppRouter } from '@/server/api/root';

import { useCatchNavigation } from '@/hooks/use-catch-navigation';

import {
  type PublishServiceRequest,
  usePublishServiceRequest,
} from '../../stores';
import { FixedFooterForm } from '../fixed-footer-form';

type BasicInfoFormProps = {
  error: TRPCClientErrorLike<AppRouter> | null;
  isLoading: boolean;
};

type BasicInfo = Pick<PublishServiceRequest, 'title' | 'description'>;

const BasicInfoForm = ({ error, isLoading }: BasicInfoFormProps) => {
  const router = useRouter();
  const { serviceSlug } = router.query as { serviceSlug: string };
  const { updateServiceRequest, serviceRequest } = usePublishServiceRequest();

  const form = useZodForm({
    mode: 'onChange',
    defaultValues: {
      title: serviceRequest?.title,
      description: serviceRequest?.description,
    },
  });

  const {
    register,
    formState: { isDirty, isSubmitted },
  } = form;

  const onHandleSubmit = (formData: BasicInfo) => {
    updateServiceRequest(formData);
    void router.push(`/publish-service-request/${serviceSlug}/duration`);
  };

  return (
    <>
      {error && <SectionMessage title={error.message} appareance="danger" />}
      <Form form={form} onSubmit={onHandleSubmit}>
        <Field label="Titre de la demande" required>
          <Input
            {...register('title')}
            placeholder="Entrez le titre de votre demande"
          />
        </Field>
        <Field label="Description de la demande" required>
          <Textarea
            {...register('description')}
            rows={8}
            cols={8}
            placeholder="Entrez la description de votre demande"
          />
        </Field>
        <FixedFooterForm>
          <Button size="lg">Suivant</Button>
        </FixedFooterForm>
      </Form>
    </>
  );
};

export { BasicInfoForm };
