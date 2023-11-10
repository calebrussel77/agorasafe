import React, { forwardRef } from 'react';
import ReactPhoneInput from 'react-phone-input-2';
import fr from 'react-phone-input-2/lang/fr.json';

import { type Variant, getVariantBorderColor } from '@/utils/variants';

import { cn } from '@/lib/utils';

import { useFocus } from '@/hooks/use-focus';
import { useMergeRefs } from '@/hooks/use-merge-refs';

export type InputProps = Omit<React.HTMLProps<HTMLInputElement>, 'onChange'> & {
  setParentValue?: (value: string) => void;
  onChange?: (value: string) => void;
  loading?: boolean;
  variant?: Variant;
  autoFocus?: boolean;
};

export const PhoneInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      setParentValue,
      value,
      loading,
      disabled,
      variant,
      onChange,
      autoFocus,
      ...props
    },
    ref
  ) => {
    const { elementRef } = useFocus(autoFocus);
    const refs = useMergeRefs(elementRef, ref);
    const hasError = variant === 'danger';

    const handleOnchange = (value: string) => {
      setParentValue && setParentValue(value);
      onChange?.(value);
    };

    return (
      <ReactPhoneInput
        localization={fr as never}
        country={'cm'}
        disableDropdown
        onChange={handleOnchange}
        containerClass="relative w-full"
        dropdownClass="rounded-md shadow-lg border"
        inputStyle={hasError ? { borderColor: 'red' } : {}}
        buttonStyle={hasError ? { borderColor: 'red' } : {}}
        value={value as string}
        inputClass={cn(
          '!flex !h-10 !w-full !rounded-md !border !border-input !bg-transparent !py-2 !text-sm !ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
          hasError && '!border-red-500'
        )}
        inputProps={{
          ref: refs,
          disabled: disabled || loading,
          'aria-invalid': hasError ? 'true' : 'false',
          autoFocus: autoFocus,
          ...props,
        }}
      />
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
