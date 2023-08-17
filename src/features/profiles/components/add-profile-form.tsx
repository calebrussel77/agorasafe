import { APP_PROFILES_INFO } from '@/constants';
import { type ProfileType } from '@prisma/client';
import { type TRPCClientErrorLike } from '@trpc/client';
import { Controller } from 'react-hook-form';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup } from '@/components/ui/radio-group';
import { SectionMessage } from '@/components/ui/section-message';
import { Typography } from '@/components/ui/typography';

import { cn } from '@/lib/utils';

import { type AppRouter } from '@/server/api/root';

export type AddProfileFormProps = {
  onSubmit: (data: AddProfileFormData) => void;
  error: TRPCClientErrorLike<AppRouter> | null;
  isLoading: boolean;
  selectedProfile: ProfileType;
};

export type AddProfileFormData = {
  profileType: ProfileType;
  name: string;
};

const AddProfileForm = ({
  onSubmit,
  error,
  isLoading,
  selectedProfile,
}: AddProfileFormProps) => {
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
      <Form
        form={form}
        onSubmit={onHandleSubmit}
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
                        'shadow-brand-500 ring-2 ring-brand-500'
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

export { AddProfileForm };
