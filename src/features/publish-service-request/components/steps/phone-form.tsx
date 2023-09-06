import { type TRPCClientErrorLike } from '@trpc/client';
import { useRouter } from 'next/router';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { PhoneInput } from '@/components/ui/phone-input';
import { SectionMessage } from '@/components/ui/section-message';

import { type AppRouter } from '@/server/api/root';

import { useCurrentUser } from '@/hooks/use-current-user';

import {
  type PublishServiceRequest,
  usePublishServiceRequest,
} from '../../stores';
import { FixedFooterForm } from '../fixed-footer-form';

type PhoneFormProps = {
  error: TRPCClientErrorLike<AppRouter> | null;
  isLoading: boolean;
};

type Address = Pick<PublishServiceRequest, 'phoneToContact'>;

const PhoneForm = ({ error, isLoading }: PhoneFormProps) => {
  const router = useRouter();
  const { serviceSlug } = router.query as { serviceSlug: string };
  const { profile } = useCurrentUser();

  const { updateServiceRequest, serviceRequest } = usePublishServiceRequest();

  const form = useZodForm({
    mode: 'onChange',
    defaultValues: {
      phoneToContact: serviceRequest?.phoneToContact || profile?.phone,
    },
  });

  const {
    control,
    formState: { isDirty, isSubmitted },
  } = form;

  const onHandleSubmit = (formData: Address) => {
    updateServiceRequest(formData);
    void router.push(`/publish-service-request/${serviceSlug}/photos`);
  };

  return (
    <>
      {error && <SectionMessage title={error.message} appareance="danger" />}
      <Form form={form} onSubmit={onHandleSubmit}>
        <Field label="Numéro de téléphone" required>
          <Controller
            control={control}
            name="phoneToContact"
            render={({ field: { ref, onChange, value }, fieldState }) => (
              <PhoneInput
                ref={ref}
                variant={fieldState.error ? 'danger' : undefined}
                autoFocus={true}
                required
                onChange={onChange}
                value={value as never}
                placeholder="Entrez le numéro de téléphone à joindre pour la prestation..."
              />
            )}
          />
        </Field>
        <SectionMessage
          hasCloseButton={false}
          appareance="info"
          title="Ces informations seront transmises uniquement aux prestataires que vous réserverez."
        />
        <FixedFooterForm>
          <Button
            type="button"
            onClick={() => void router.back()}
            variant="ghost"
            size="lg"
          >
            Retour
          </Button>
          <Button size="lg">Suivant</Button>
        </FixedFooterForm>
      </Form>
    </>
  );
};

export { PhoneForm };
