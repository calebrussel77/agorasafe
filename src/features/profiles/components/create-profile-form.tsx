import { APP_PROFILES_INFO } from '@/constants';
import { useLocationSearch } from '@/services';
import { phoneSchema } from '@/validations';
import { ProfileType } from '@prisma/client';
import { type TRPCClientErrorLike } from '@trpc/client';
import { CameraIcon, MapPin } from 'lucide-react';
import { useTransition } from 'react';
import { Controller } from 'react-hook-form';
import { z } from 'zod';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ComboBox } from '@/components/ui/combobox';
import { Field } from '@/components/ui/field';
import { FileUpload } from '@/components/ui/file-upload';
import { Form, useZodForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { RadioGroup } from '@/components/ui/radio-group';
import { SectionMessage } from '@/components/ui/section-message';
import { toast } from '@/components/ui/toast';
import { Typography } from '@/components/ui/typography';
import { useUpload } from '@/components/ui/uploadthing';

import { isArray } from '@/utils/type-guards';

import { cn } from '@/lib/utils';

import { type AppRouter } from '@/server/api/root';

const schema = z.object({
  avatar: z.any().optional(),
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
  });

  const { startUpload, isUploading } = useUpload({
    endpoint: 'profilePhotos',
    onError(error) {
      toast({
        variant: 'danger',
        title: "Une erreur s'est produite",
        description:
          "Une erreur s'est produite lors de l'upload de votre avatar",
      });
    },
  });

  const { control, watch } = form;

  const { locationSearch, setLocationSearch, data, isFetching } =
    useLocationSearch();

  const watchLocation = watch('location');
  const watchPhone = watch('phone');
  const watchName = watch('name');

  const isDisabled =
    isLoading ||
    isUploading ||
    !watchName ||
    !watchLocation ||
    !watchPhone ||
    watchPhone.length <= 3;

  const onHandleSubmit = async (formData: CreateNewProfileInput) => {
    const files = formData?.avatar
      ? await startUpload([formData?.avatar as File])
      : undefined;

    const formattedAvatar = isArray(files) && files ? files[0]?.url : undefined;

    onSubmit({
      ...formData,
      phone: `+${formData.phone}`,
      avatar: formattedAvatar,
    });
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
        <div className="mx-auto flex items-center justify-center">
          <Field>
            <Controller
              control={control}
              name="avatar"
              render={({ field: { ref, onChange, value } }) => (
                <FileUpload
                  ref={ref}
                  onChange={onChange}
                  value={(value as never) || []} // When you aren't give a default value, we have a max rerender issues
                  preview={null}
                >
                  {({ openFile, files }) => {
                    return (
                      <Badge
                        content={
                          <button
                            type="button"
                            onClick={openFile}
                            className="rounded-full p-0.5"
                          >
                            <CameraIcon className="h-4 w-4" />
                          </button>
                        }
                        variant="primary"
                        size="sm"
                        placement="bottom-right"
                      >
                        <Avatar
                          className="h-20 w-20"
                          onClick={openFile}
                          alt="preview image"
                          src={files[0]?.preview || undefined}
                          isBordered
                        />
                      </Badge>
                    );
                  }}
                </FileUpload>
              )}
            />
          </Field>
        </div>
        <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2">
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
          <Field label="Numéro de téléphone" required>
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
        </div>
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
          isLoading={isLoading || isUploading}
          className="mt-6 flex w-full items-center justify-center font-semibold"
        >
          Créer le profil
        </Button>
      </Form>
    </>
  );
};

export { CreateProfileForm };
