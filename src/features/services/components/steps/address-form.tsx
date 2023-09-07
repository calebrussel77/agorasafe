import { useLocationSearch } from '@/services';
import { type TRPCClientErrorLike } from '@trpc/client';
import { MapPin } from 'lucide-react';
import { useRouter } from 'next/router';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { ComboBox } from '@/components/ui/combobox';
import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { SectionMessage } from '@/components/ui/section-message';

import { type AppRouter } from '@/server/api/root';

import { useCurrentUser } from '@/hooks/use-current-user';

import {
  type PublishServiceRequest,
  usePublishServiceRequest,
} from '../../stores';
import { FixedFooterForm } from '../fixed-footer-form';

type AddressFormProps = {
  error: TRPCClientErrorLike<AppRouter> | null;
  isLoading: boolean;
};

type Address = Pick<PublishServiceRequest, 'location'>;

const AddressForm = ({ error, isLoading }: AddressFormProps) => {
  const router = useRouter();
  const { serviceSlug } = router.query as { serviceSlug: string };
  const { profile } = useCurrentUser();

  const { updateServiceRequest, serviceRequest } = usePublishServiceRequest();

  const { locationSearch, setLocationSearch, data, isFetching } =
    useLocationSearch();

  const form = useZodForm({
    mode: 'onChange',
    defaultValues: {
      location: serviceRequest?.location || {
        value: profile?.location?.name,
        label: profile?.location?.name,
      },
    },
  });

  const {
    control,
    formState: { isDirty, isSubmitted },
  } = form;

  const onHandleSubmit = (formData: Address) => {
    updateServiceRequest(formData);
    void router.push(`/publish-service-request/${serviceSlug}/phone`);
  };

  return (
    <>
      {error && <SectionMessage title={error.message} appareance="danger" />}
      <Form form={form} onSubmit={onHandleSubmit}>
        <Field label="Localisation" required>
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, value } }) => (
              <ComboBox
                onChange={onChange}
                value={value as never}
                isLoading={isFetching}
                onSearchChange={setLocationSearch}
                placeholder="Choisir la localisation de la prestation..."
                placeholderSearch="Recherchez votre position..."
                iconAfter={<MapPin className="h-5 w-5 opacity-50" />}
                search={locationSearch}
                options={data?.map(element => ({
                  label: element.place_name,
                  value: element.place_name,
                  wikidata: element.properties.wikidata,
                  lat: element.center[0],
                  long: element.center[1],
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

export { AddressForm };
