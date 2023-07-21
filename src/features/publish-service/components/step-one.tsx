import { type TRPCClientErrorLike } from '@trpc/client';

import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SectionMessage } from '@/components/ui/section-message';
import { Textarea } from '@/components/ui/textarea';

import { type AppRouter } from '@/server/api/root';

type StepOneFormProps = {
  error: TRPCClientErrorLike<AppRouter> | null;
  isLoading: boolean;
};

export const PUBLISH_SERVICE_STEP_ONE_FORM_ID =
  'PUBLISH_SERVICE_STEP_ONE_FORM_ID';

const StepOneForm = ({ error, isLoading }: StepOneFormProps) => {
  const form = useZodForm({
    mode: 'onChange',
  });

  const { control, watch } = form;

  const onHandleSubmit = (formData: string) => {
    console.log(formData);
  };

  return (
    <>
      <Form
        form={form}
        onSubmit={onHandleSubmit}
        id={PUBLISH_SERVICE_STEP_ONE_FORM_ID}
      >
        {error && <SectionMessage title={error.message} />}
        <Field label="Titre de la demande" required>
          <Input placeholder="Entrez le titre de votre demande" />
        </Field>
        <Field label="Description de la demande" required>
          <Textarea
            rows={8}
            cols={8}
            placeholder="Entrez la description de votre demande"
          />
        </Field>
      </Form>
    </>
  );
};

export { StepOneForm };
