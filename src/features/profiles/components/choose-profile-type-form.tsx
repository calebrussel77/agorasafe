import { APP_PROFILES_INFO } from '@/constants';
import { ProfileType } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { Typography } from '@/components/ui/typography';
import { VariantMessage } from '@/components/ui/variant-message';

import { noop } from '@/utils/misc';

import { cn } from '@/lib/utils';

const ChooseProfileTypeForm = () => {
  const form = useZodForm({});
  const router = useRouter();

  const {
    control,
    watch,
    formState: { errors },
  } = form;

  const watchProfileType = watch('profileType') as ProfileType;

  return (
    <Form onSubmit={noop} form={form}>
      <Controller
        name="profileType"
        control={control}
        defaultValue={ProfileType.PROVIDER}
        render={({ field }) => (
          <RadioGroup
            required
            onValueChange={field.onChange}
            defaultValue={field.value as never}
          >
            {APP_PROFILES_INFO.map(siteProfile => (
              <Field
                key={siteProfile.type}
                className={cn(
                  'flex flex-row gap-2 rounded-md border p-4 shadow transition duration-300 hover:bg-zinc-100',
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
                <RadioGroup.Item value={siteProfile.type} />
              </Field>
            ))}
          </RadioGroup>
        )}
      />
      {errors && (
        <VariantMessage variant="danger">
          {
            (errors as typeof errors & { requiredError: { message: string } })
              ?.requiredError?.message
          }
        </VariantMessage>
      )}
      <Link
        href={{
          pathname: '/onboarding/add-new-profile',
          query: {
            ...router.query,
            profile_type: watchProfileType,
          },
        }}
      >
        <Button className="flex w-full items-center justify-center font-semibold">
          <span>Continuer</span>
        </Button>
      </Link>
    </Form>
  );
};

export { ChooseProfileTypeForm };
