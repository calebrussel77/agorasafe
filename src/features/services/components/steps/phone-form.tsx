import { useRouter } from 'next/router';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { PhoneInput } from '@/components/ui/phone-input';
import { SectionMessage } from '@/components/ui/section-message';

import { useCurrentUser } from '@/hooks/use-current-user';

import {
  type PublishServiceRequestFormStore,
  usePublishServiceRequest,
} from '../../stores';
import { FixedFooterContainer } from '@/components/fixed-footer-container';

type Address = Pick<PublishServiceRequestFormStore, 'phoneToContact'>;

type PhoneFormProps = { nextStep: () => void; prevStep: () => void };

const PhoneForm = ({ nextStep, prevStep }: PhoneFormProps) => {
  const { query } = useRouter();
  const categorySlugQuery = query.category as string;

  const { updateServiceRequest, serviceRequest: _serviceRequest } =
    usePublishServiceRequest();

  const serviceRequest = _serviceRequest?.[categorySlugQuery];
  const { profile } = useCurrentUser();

  const form = useZodForm({
    mode: 'onChange',
    defaultValues: {
      phoneToContact: serviceRequest?.phoneToContact || profile?.phone,
    },
  });

  const { control } = form;

  const onHandleSubmit = (formData: Address) => {
    updateServiceRequest(formData, categorySlugQuery);
    nextStep();
  };

  return (
    <>
      <Form form={form} onSubmit={onHandleSubmit}>
        <Field label="Numéro de téléphone" required>
          <Controller
            control={control}
            rules={{
              required: 'Le numéro de téléphone à contacter est requis',
            }}
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
        <FixedFooterContainer>
          <Button type="button" onClick={prevStep} variant="ghost" size="lg">
            Retour
          </Button>
          <Button size="lg">Suivant</Button>
        </FixedFooterContainer>
      </Form>
    </>
  );
};

export { PhoneForm };
