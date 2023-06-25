import { type FC } from 'react';

import { Field } from '@/components/ui/fields';
import { Form, useZodForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface FormSubscriptionProps {
  formId: string;
  onSubmit: (data: { email: string; name: string }) => void;
}
const FormSubscription: FC<FormSubscriptionProps> = ({ onSubmit, formId }) => {
  const form = useZodForm({});

  const { register } = form;

  return (
    <Form form={form} onSubmit={onSubmit} id={formId} className="space-y-6">
      <Field required aria-label="Nom" label="Nom">
        <Input autoFocus placeholder="Entrez votre nom" {...register('name')} />
      </Field>
      <Field required aria-label="Adresse email" label="Adresse email">
        <Input
          placeholder="Entrez votre adresse email"
          {...register('email')}
        />
      </Field>
    </Form>
  );
};

export { FormSubscription };
