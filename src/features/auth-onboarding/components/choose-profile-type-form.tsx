import { siteProfiles } from '@/constants';
import { ProfileType } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { type FC } from 'react';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Form, useZodForm } from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { VariantMessage } from '@/components/ui/variant-message';

interface ChooseProfileTypeFormProps {
  className?: string;
}

const ChooseProfileTypeForm: FC<ChooseProfileTypeFormProps> = ({}) => {
  const form = useZodForm({});
  const router = useRouter();
  const {
    control,
    formState: { errors },
  } = form;

  const onSubmit = (data: { profile_type: ProfileType }) => {
    void router.push({
      pathname: 'register-infos',
      query: {
        profile_type: data.profile_type,
      },
    });
  };

  return (
    <Form onSubmit={onSubmit} form={form}>
      <Controller
        name="profile_type"
        control={control}
        defaultValue={ProfileType.PROVIDER}
        render={({ field }) => (
          <RadioGroup
            required
            onValueChange={field.onChange}
            defaultValue={field.value as never}
          >
            {siteProfiles.map(siteProfile => (
              <div
                key={siteProfile.type}
                className="rounded-md border p-4 shadow"
              >
                <Field
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
      {errors && (
        <VariantMessage variant="danger">
          {
            (errors as typeof errors & { requiredError: { message: string } })
              ?.requiredError?.message
          }
        </VariantMessage>
      )}
      <Button className="w-full flex font-semibold items-center justify-center">
        <span>Continuer</span>
      </Button>
    </Form>
  );
};

export { ChooseProfileTypeForm };
