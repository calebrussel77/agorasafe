import { forwardRef } from 'react';
import type StateManagedSelect from 'react-select';
import ReactSelect from 'react-select';

import { type Variant } from '@/utils/variants';

import { defaultComponents } from './_components';
import { defaultStyles, defaultTheme } from './_components/styles';

type SelectProps = React.ComponentProps<StateManagedSelect> & {
  variant?: Variant;
  isLoading?: boolean;
};

const Select = forwardRef<any, SelectProps>(
  ({ styles, value, components, onChange, variant, ...rest }, ref) => {
    return (
      <ReactSelect
        ref={ref}
        isClearable
        {...rest}
        value={value}
        onChange={onChange}
        aria-invalid={variant === 'danger' ? 'true' : 'false'}
        components={{
          ...defaultComponents,
          ...components,
        }}
        styles={{
          ...defaultStyles(variant),
          ...styles,
        }}
        theme={defaultTheme}
        classNamePrefix="agorasafe__select"
      />
    );
  }
);

Select.displayName = 'Select';

export { Select };
