import { forwardRef } from 'react';
import DefaultAsyncSelect from 'react-select/async';

import { type Variant } from '@/utils/variants';

import { defaultComponents } from './_components';
import { defaultStyles, defaultTheme } from './_components/styles';

const AsyncSelect = forwardRef<
  any,
  React.ComponentProps<DefaultAsyncSelect> & {
    variant?: Variant;
  }
>(({ styles, components, onChange, value, variant, ...rest }, ref) => {
  return (
    <DefaultAsyncSelect
      ref={ref}
      value={value}
      filterOption={() => true}
      aria-invalid={variant === 'danger' ? 'true' : 'false'}
      onChange={onChange}
      isClearable
      components={{
        ...defaultComponents,
        ...components,
      }}
      {...rest}
      styles={{ ...defaultStyles(variant), ...styles }}
      theme={defaultTheme}
      classNamePrefix="agorasafe__select"
    />
  );
});

AsyncSelect.displayName = 'AsyncSelect';

export { AsyncSelect };
