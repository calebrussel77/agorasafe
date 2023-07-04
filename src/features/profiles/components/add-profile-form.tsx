import { siteProfiles } from '@/constants';
import { useLocationSearch } from '@/services';
import { ProfileType } from '@prisma/client';
import { type TRPCClientErrorLike } from '@trpc/client';
import { MapPin } from 'lucide-react';
import { Controller } from 'react-hook-form';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup } from '@/components/ui/radio-group';
import { SectionMessage } from '@/components/ui/section-message';

import { type AppRouter } from '@/server/api/root';

type AuthRegisterInfosFormProps = {
  onSubmit: (data: AddProfileFormData) => void;
  error: TRPCClientErrorLike<AppRouter> | null;
  isLoading: boolean;
  selectedProfile: ProfileType;
};

export type AddProfileFormData = {
  profile_type: ProfileType;
  name: string;
};

const AddProfileForm = ({
  onSubmit,
  error,
  isLoading,
  selectedProfile,
}: AuthRegisterInfosFormProps) => {
  const form = useZodForm({
    mode: 'onChange',
  });

  const { control, watch } = form;

  const onHandleSubmit = (formData: AddProfileFormData) => {
    onSubmit({
      ...formData,
    });
  };

  const watchName = watch('name') as string;

  const isDisabled = isLoading || !watchName;

  return (
    <>
      <Form form={form} onSubmit={onHandleSubmit}>
        {error && <SectionMessage title={error.message} />}
        <div className="mx-auto flex justify-center items-center">
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
                value={value as never}
                placeholder="Entrez le nom de votre profile"
              />
            )}
          />
        </Field>
        <Field label="Type" required>
          <Controller
            name="profile_type"
            control={control}
            defaultValue={selectedProfile}
            render={({ field }) => (
              <RadioGroup
                required
                disabled
                onValueChange={field.onChange}
                defaultValue={field.value as never}
              >
                {siteProfiles.map(siteProfile => (
                  <div
                    key={siteProfile.type}
                    className="rounded-md border p-4 shadow"
                  >
                    <Field
                      className="flex flex-row gap-1"
                      label={
                        <div>
                          <h3 className="font-semibold">{siteProfile.title}</h3>
                          <p className="font-normal text-sm">
                            {siteProfile.description}
                          </p>
                        </div>
                      }
                    >
                      <RadioGroup.Item value={siteProfile.type} />
                    </Field>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </Field>
        <Button
          disabled={isDisabled}
          isLoading={isLoading}
          className="mt-6 w-full flex font-semibold items-center justify-center"
        >
          Créer le profile
        </Button>
      </Form>
    </>
  );
};

export { AddProfileForm };
