import { APP_PROFILES_INFO } from '@/constants';
import { useLocationSearch } from '@/services';
import { phoneSchema } from '@/validations';
import { ProfileType } from '@prisma/client';
import { type TRPCClientErrorLike } from '@trpc/client';
import { MapPin } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { z } from 'zod';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ComboBox } from '@/components/ui/combobox';
import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { RadioGroup } from '@/components/ui/radio-group';
import { SectionMessage } from '@/components/ui/section-message';
import { Typography } from '@/components/ui/typography';

import { cn } from '@/lib/utils';

import { type AppRouter } from '@/server/api/root';

const schema = z.object({
  name: z.string(),
  phone: phoneSchema,
  profileType: z.nativeEnum(ProfileType),
  location: z.object({
    value: z.string(),
    label: z.string(),
    lat: z.coerce.string(),
    long: z.coerce.string(),
    wikidata: z.string().optional(),
  }),
});

export type CreateNewProfileInput = z.infer<typeof schema>;

export type CreateProfileFormProps = {
  onSubmit: (data: CreateNewProfileInput) => void;
  error: TRPCClientErrorLike<AppRouter> | null;
  isLoading: boolean;
  selectedProfile: ProfileType;
};

const CreateProfileForm = ({
  onSubmit,
  error,
  isLoading,
  selectedProfile,
}: CreateProfileFormProps) => {
  const form = useZodForm({
    schema,
    mode: 'onChange',
  });

  const {
    control,
    watch,
    formState: { errors },
  } = form;

  const { locationSearch, setLocationSearch, data, isFetching } =
    useLocationSearch();

  const watchLocation = watch('location');
  const watchPhone = watch('phone');
  const watchName = watch('name');

  const isDisabled =
    isLoading ||
    !watchName ||
    !watchLocation ||
    !watchPhone ||
    watchPhone.length <= 3;

  const onHandleSubmit = (formData: CreateNewProfileInput) => {
    onSubmit({
      ...formData,
      phone: `+${formData.phone}`,
    });
  };

  return (
    <>
      {error && <SectionMessage title={error.message} />}
      <Form
        form={form}
        onSubmit={onHandleSubmit}
        // className="space-y-3"
        aria-label="add_profile_form_test_id"
      >
        {error && <SectionMessage title={error.message} />}
        <div className="mx-auto flex items-center justify-center">
          <Avatar size="xl" />
        </div>
        <Field label="Nom" required>
          <Controller
            control={control}
            name="name"
            render={({ field: { ref, onChange, value }, fieldState }) => (
              <Input
                ref={ref}
                variant={fieldState.error ? 'danger' : undefined}
                autoFocus={true}
                onChange={onChange}
                value={(value as never) || ''}
                placeholder="Entrez le nom de votre profil"
              />
            )}
          />
        </Field>
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
            render={({ field: { onChange, value }, fieldState }) => (
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
        <Field label="Type" required>
          <Controller
            name="profileType"
            control={control}
            defaultValue={selectedProfile}
            render={({ field }) => (
              <RadioGroup
                required
                disabled
                onValueChange={field.onChange}
                defaultValue={field.value as never}
              >
                {APP_PROFILES_INFO.map(siteProfile => (
                  <Field
                    key={siteProfile.type}
                    className={cn(
                      'flex flex-row gap-2 rounded-md border p-4 opacity-60 shadow',
                      field.value === siteProfile.type &&
                        'shadow-brand-500 ring-2 ring-brand-500',
                      field.value !== siteProfile.type && 'hidden'
                    )}
                    label={
                      <div>
                        <Typography as="h4">{siteProfile.title}</Typography>
                        <Typography variant="small" className="font-normal">
                          {siteProfile.description}
                        </Typography>
                      </div>
                    }
                  >
                    <RadioGroup.Item
                      aria-label={`${siteProfile.type}--radio_profile_item`}
                      value={siteProfile.type}
                    />
                  </Field>
                ))}
              </RadioGroup>
            )}
          />
        </Field>
        <Button
          aria-label="Créer un nouveau profil"
          disabled={isDisabled}
          isLoading={isLoading}
          className="mt-6 flex w-full items-center justify-center font-semibold"
        >
          Créer le profil
        </Button>
      </Form>
    </>
  );
};

export { CreateProfileForm };
