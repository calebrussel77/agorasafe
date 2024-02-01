/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from '@hookform/resolvers/zod';
import { type VariantProps, cva } from 'class-variance-authority';
import React, { type ComponentProps } from 'react';
import {
  type FieldValues,
  FormProvider,
  type SubmitErrorHandler,
  type SubmitHandler,
  type UseFormProps,
  type UseFormReturn,
  useForm,
} from 'react-hook-form';
import { type z } from 'zod';

import { cn } from '@/lib/utils';

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onError?: SubmitErrorHandler<T>;
  onSubmit?: SubmitHandler<T>;
} & VariantProps<typeof formToken> &
  Pick<
    React.HTMLProps<HTMLFormElement>,
    'className' | 'children' | 'onKeyDown' | 'id'
  >;

const formToken = cva(['disabled:opacity-70 disabled:cursor-not-allowed'], {
  variants: {
    gap: {
      sm: ['space-y-3'],
      md: ['space-y-6'],
      lg: ['space-y-9'],
      xl: ['space-y-12'],
    },
  },
  compoundVariants: [{ gap: 'md' }],
  defaultVariants: {
    gap: 'md',
  },
});

const Form = <T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  gap,
  onError,
  ...props
}: Props<T>) => {
  const handleError: SubmitErrorHandler<T> = (errors, e) => {
    onError?.(errors, e);
    Object.entries(errors).forEach(([key, value]) =>
      console.warn(`${key}: Form validation: ${value?.message as string}`, {
        value,
      })
    );
  };

  const handleSubmit = onSubmit
    ? form.handleSubmit(onSubmit, handleError)
    : (e: React.FormEvent<HTMLFormElement>) => e.preventDefault();

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit}
        className={cn(
          formToken({
            gap,
          }),
          className,
          'space-y-0'
        )}
        {...props}
      >
        {/* <fieldset> passes the form's 'disabled' state to all of its elements,
            allowing us to handle disabled style variants with just className */}
        <fieldset
          disabled={form?.formState?.isSubmitting}
          className={cn(
            formToken({
              gap,
            }),
            className
          )}
        >
          {children}
        </fieldset>
      </form>
    </FormProvider>
  );
};

interface UseZodFormProps<S extends z.ZodSchema>
  extends Exclude<UseFormProps<z.infer<S>>, 'resolver'> {
  schema?: S;
}

const useZodForm = <S extends z.ZodSchema>({
  schema,
  ...formProps
}: UseZodFormProps<S>) =>
  useForm({
    ...formProps,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    resolver: schema ? zodResolver(schema) : undefined,
  });

export { Form, useZodForm };
