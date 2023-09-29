import { z } from 'zod';

import { CanView } from '@/components/can-view';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

import { LoginRedirect } from '@/features/auth';

import { api } from '@/utils/api';

import { cn } from '@/lib/utils';

import { useCreateServiceRequestOffer } from '../services';

const schema = z.object({
  text: z.string().trim(),
});

export type ServiceRequestOfferFormInput = z.infer<typeof schema>;

const ServiceRequestOfferForm = ({
  serviceRequestSlug,
  className,
}: {
  className?: string;
  serviceRequestSlug: string;
}) => {
  const form = useZodForm({
    schema,
  });

  const { register, setValue } = form;
  const queryUtils = api.useContext();

  const { mutate, isLoading } = useCreateServiceRequestOffer({
    onSuccess: async () => {
      setValue('text', '');
      await queryUtils.services.getServiceRequestOffers.invalidate({
        serviceRequestSlug,
      });
    },
  });

  const onHandleSubmit = (formData: ServiceRequestOfferFormInput) => {
    mutate({
      text: formData?.text,
      serviceRequestSlug,
    });
  };

  return (
    <Form
      form={form}
      onSubmit={onHandleSubmit}
      className={cn('space-y-2', className)}
    >
      <Field
        // hint="En quoi votre offre pourrait-elle être meilleure par rapport aux autres ?"
        label="Votre commentaire"
        required
      >
        <Textarea
          {...register('text')}
          rows={6}
          cols={6}
          placeholder="Votre commentaire..."
        />
      </Field>
      <div className="flex items-end justify-end">
        <LoginRedirect reason="make-service-request-offer">
          <Button isLoading={isLoading}>Envoyer</Button>
        </LoginRedirect>
      </div>
    </Form>
  );
};

export { ServiceRequestOfferForm };
