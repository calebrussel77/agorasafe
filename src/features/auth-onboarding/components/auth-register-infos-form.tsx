import { useLocationSearch } from '@/services';
import { type TRPCClientErrorLike } from '@trpc/client';
import { MapPin } from 'lucide-react';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { ComboBox } from '@/components/ui/combobox';
import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { PhoneInput } from '@/components/ui/phone-input';
import { SectionMessage } from '@/components/ui/section-message';

import { type AppRouter } from '@/server/api/root';

type AuthRegisterInfosFormProps = {
  onSubmit: (data: AuthRegisterInfosFormData) => void;
  error: TRPCClientErrorLike<AppRouter> | null;
  isLoading: boolean;
};

type Location = {
  label: string;
  value: string;
  wikidata: string;
  lat: string;
  long: string;
};

export type AuthRegisterInfosFormData = {
  location: Location;
  phone: string;
};

const AuthRegisterInfosForm = ({
  onSubmit,
  error,
  isLoading,
}: AuthRegisterInfosFormProps) => {
  const form = useZodForm({
    mode: 'onChange',
  });

  const { locationSearch, setLocationSearch, data, isFetching } =
    useLocationSearch();

  const { control, watch } = form;

  const onHandleSubmit = (formData: AuthRegisterInfosFormData) => {
    onSubmit({
      ...formData,
      phone: `+${formData.phone}`,
    });
  };

  const watchLocation = watch('location') as unknown;
  const watchPhone = watch('phone') as string;

  const isDisabled =
    isLoading || !watchLocation || !watchPhone || watchPhone.length <= 3;

  return (
    <>
      <Form form={form} onSubmit={onHandleSubmit}>
        {error && <SectionMessage title={error.message} />}
        <Field
          label="Numéro de téléphone"
          hint="Sauf si vous donnez votre autorisation, votre numéro restera confidentiel aux autres membres."
          required
        >
          <Controller
            control={control}
            name="phone"
            render={({ field: { ref, onChange, value }, fieldState }) => (
              <PhoneInput
                ref={ref}
                variant={fieldState.error ? 'danger' : undefined}
                autoFocus={true}
                onChange={onChange}
                value={value as never}
                placeholder="Entrez votre numéro de téléphone"
              />
            )}
          />
        </Field>
        <Field
          label="Localisation"
          hint="Nous vous proposerons du contenu pertinent en fonction de cette position"
          required
        >
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, value } }) => (
              <ComboBox
                onChange={onChange}
                value={value as never}
                isLoading={isFetching}
                onSearchChange={setLocationSearch}
                placeholder="Choisir ma localisation..."
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

        <Button
          disabled={isDisabled}
          className="mt-6 w-full flex font-semibold items-center justify-center"
        >
          {isLoading ? 'Chargement...' : <span>Terminer</span>}
        </Button>
      </Form>
    </>
  );
};

export { AuthRegisterInfosForm };
