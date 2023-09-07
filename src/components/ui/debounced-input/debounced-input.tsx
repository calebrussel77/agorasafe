/* eslint-disable no-unused-vars */
import { forwardRef, useEffect, useState } from 'react';


import { Input, type InputProps } from '../input';
import { useDebounce } from '@/hooks/use-debounce';
import { createEvent } from '../file-upload/create-event';

// A debounced input component
type DebouncedInputProps = {
  value: string | number;
  debounce?: number;
} & InputProps;

const DebouncedInput = forwardRef<HTMLInputElement, DebouncedInputProps>(
  ({ value: initialValue, onChange, debounce = 500, ...props }, ref) => {
    const [value, setValue] = useState(initialValue || '');

    useDebounce(
      () => {
        const event = createEvent({ value });
        onChange && onChange(event as never);
      },
      debounce,
      [value]
    );

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <Input
        ref={ref}
        {...props}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
    );
  }
);

export { DebouncedInput };

DebouncedInput.displayName = 'DebouncedInput';
