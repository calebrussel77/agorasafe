import { type TRPCClientErrorLike } from '@trpc/client';
import { useRouter } from 'next/router';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SectionMessage } from '@/components/ui/section-message';
import { Textarea } from '@/components/ui/textarea';

import { type AppRouter } from '@/server/api/root';

import { FixedFooterForm } from './fixed-footer-form';

type StepOneFormProps = {
  error: TRPCClientErrorLike<AppRouter> | null;
  isLoading: boolean;
};

const StepOneForm = ({ error, isLoading }: StepOneFormProps) => {
  const router = useRouter();
  const { serviceSlug } = router.query as { serviceSlug: string };

  const form = useZodForm({
    mode: 'onChange',
  });

  const { register, watch } = form;

  const onHandleSubmit = (formData: unknown) => {
    console.log(formData);
    void router.push(`/publish-service/${serviceSlug}/duration`);
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
          {/* <Button variant="ghost" size="lg">
            Retour
          </Button> */}
          <Button size="lg">Suivant</Button>
        </FixedFooterForm>
      </Form>
    </>
  );
};

export { StepOneForm };
