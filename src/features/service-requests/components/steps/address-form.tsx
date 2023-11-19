import { useRouter } from 'next/router';
import { Controller } from 'react-hook-form';

import { PlacesAutocomplete } from '@/components/agorasafe-map';
import { FixedFooterContainer } from '@/components/fixed-footer-container';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { SectionMessage } from '@/components/ui/section-message';

import { useCurrentUser } from '@/hooks/use-current-user';

import {
  type PublishServiceRequestFormStore,
  usePublishServiceRequest,
} from '../../stores';

type Address = Pick<PublishServiceRequestFormStore, 'location'>;
type AddressFormProps = { nextStep: () => void; prevStep: () => void };

const AddressForm = ({ nextStep, prevStep }: AddressFormProps) => {
  const { query } = useRouter();
  const categorySlugQuery = query.category as string;

  const { updateServiceRequest, serviceRequest: _serviceRequest } =
    usePublishServiceRequest();
  const serviceRequest = _serviceRequest?.[categorySlugQuery];
  const { profile } = useCurrentUser();

  const form = useZodForm({
    mode: 'onChange',
    defaultValues: {
      location: serviceRequest?.location || profile?.location,
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
        <Field label="Localisation" required>
          <Controller
            control={control}
            name="location"
            rules={{ required: "L'adresse de localisation est requise." }}
            render={({ field: { onChange, value } }) => (
              <PlacesAutocomplete
                className="w-full"
                placeholder="Choisir la localisation de la prestation..."
                placeholderSearch="Recherchez la localisation..."
                onSelectPlace={onChange}
                selectedPlace={value as never}
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

export { AddressForm };
