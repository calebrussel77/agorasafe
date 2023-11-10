import { forwardRef } from 'react';
import DefaultAsyncCreatableSelect from 'react-select/async-creatable';

import { type Variant } from '@/utils/variants';

import { defaultComponents } from './_components';
import { defaultStyles, defaultTheme } from './_components/styles';

export const FormatCreateLabel = ({ inputValue }: { inputValue: string }) => {
  return (
    <p className="flex items-center justify-center space-x-1 text-center">
      <span>Créer</span>
      <span className="font-bold">" {inputValue} "</span>
    </p>
  );
};

const AsyncCreatableSelect = forwardRef<
  any,
  React.ComponentProps<DefaultAsyncCreatableSelect> & {
    variant?: Variant;
    setParentValue?: any;
  }
>(
  (
    {
      styles,
      components,
      onChange,
      loadOptions,
      defaultValue,
      value,
      variant,
      setParentValue,
      ...rest
    },
    ref
  ) => {
    return (
      <DefaultAsyncCreatableSelect
        ref={ref}
        cacheOptions={false}
        isClearable
        filterOption={() => true}
        {...rest}
        value={value}
        aria-invalid={variant === 'danger' ? 'true' : 'false'}
        onChange={onChange}
        loadOptions={loadOptions}
        formatCreateLabel={inputValue => (
          <FormatCreateLabel inputValue={inputValue} />
        )}
        components={{
          ...defaultComponents,
          ...components,
        }}
        styles={{ ...defaultStyles(variant), ...styles }}
        theme={defaultTheme}
        classNamePrefix="agorasafe__select"
      />
    );
  }
);

AsyncCreatableSelect.displayName = 'AsyncCreatableSelect';

export { AsyncCreatableSelect };
