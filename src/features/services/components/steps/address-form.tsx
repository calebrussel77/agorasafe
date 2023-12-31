import { useGeocodingSearch } from '@/services';
import { MapPin } from 'lucide-react';
import { useRouter } from 'next/router';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { ComboBox } from '@/components/ui/combobox';
import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { SectionMessage } from '@/components/ui/section-message';

import { useCurrentUser } from '@/hooks/use-current-user';

import {
  type PublishServiceRequestFormStore,
  usePublishServiceRequest,
} from '../../stores';
import { FixedFooterForm } from '../fixed-footer-form';

type Address = Pick<PublishServiceRequestFormStore, 'location'>;
type AddressFormProps = { nextStep: () => void; prevStep: () => void };

const AddressForm = ({ nextStep, prevStep }: AddressFormProps) => {
  const { query } = useRouter();
  const categorySlugQuery = query.category as string;

  const { updateServiceRequest, serviceRequest: _serviceRequest } =
    usePublishServiceRequest();
  const serviceRequest = _serviceRequest?.[categorySlugQuery];
  const { profile } = useCurrentUser();

  const { locationSearch, setLocationSearch, data, isInitialLoading } =
    useGeocodingSearch();

  const form = useZodForm({
    mode: 'onChange',
    defaultValues: {
      location: serviceRequest?.location || {
        value: profile?.location?.name,
        label: profile?.location?.name,
      },
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
              <ComboBox
                onChange={onChange}
                value={value as never}
                isLoading={isInitialLoading}
                onSearchChange={setLocationSearch}
                placeholder="Choisir la localisation de la prestation..."
                placeholderSearch="Recherchez la localisation..."
                iconAfter={<MapPin className="h-5 w-5 opacity-50" />}
                search={locationSearch}
                options={data?.map(element => ({
                  label: element.format?.label,
                  value: element.format?.label,
                  lat: element.format?.lat,
                  long: element?.format?.long,
                }))}
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
          <Button type="button" onClick={prevStep} variant="ghost" size="lg">
            Retour
          </Button>
          <Button size="lg">Suivant</Button>
        </FixedFooterForm>
      </Form>
    </>
  );
};

export { AddressForm };
