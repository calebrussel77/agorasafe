import { type TRPCClientErrorLike } from '@trpc/client';
import { z } from 'zod';

import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SectionMessage } from '@/components/ui/section-message';
import { Textarea } from '@/components/ui/textarea';

import { type AppRouter } from '@/server/api/root';

const schema = z.object({
  price: z.coerce
    .number()
    .min(200, 'Votre proposition doit être supérieure à 200 Frs')
    .optional(),
  text: z.string().trim(),
});

export type CreateNewProfileInput = z.infer<typeof schema>;

export type MakeOfferFormProps = {
  onSubmit: (data: CreateNewProfileInput) => void;
  error: TRPCClientErrorLike<AppRouter> | null;
  isLoading: boolean;
};

const MakeOfferForm = ({
  onSubmit,
  error,
  isLoading,
}: Partial<MakeOfferFormProps>) => {
  const form = useZodForm({
    schema,
    mode: 'onChange',
  });

  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const onHandleSubmit = (formData: CreateNewProfileInput) => {
    // onSubmit({
    //   ...formData,
    //   phone: `+${formData.phone}`,
    // });
  };

  return (
    <>
      {error && <SectionMessage title={error.message} />}
      <Form
        form={form}
        onSubmit={onHandleSubmit}
        aria-label="add_profile_form_test_id"
      >
        {error && <SectionMessage title={error.message} />}
        <Field label="Prix proposé (CFA)">
          <Input
            {...register('price')}
            type="number"
            placeholder="Entrez votre prix souhaité..."
          />
        </Field>
        <Field
          hint="En quoi votre offre pourrait-elle être meilleure par rapport aux autres ?"
          label="Commentaire"
          required
        >
          <Textarea
            {...register('text')}
            rows={8}
            cols={8}
            placeholder="Votre commentaire..."
          />
        </Field>
      </Form>
    </>
  );
};

export { MakeOfferForm };
