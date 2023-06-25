import React, { forwardRef } from 'react';

import { Label, type LabelOptions } from '../label';

export interface FieldGroupOptions {
  // specific to fieldset, we need to override children
  children: React.ReactNode;
  label?: string | React.ReactElement;
  dataTestId?: string;
  required?: LabelOptions['required'];
}

export type FieldGroupProps = React.HTMLProps<HTMLFieldSetElement> &
  FieldGroupOptions;

export const FieldGroup = forwardRef<HTMLFieldSetElement, FieldGroupProps>(
  ({ children, dataTestId, label, required, ...rest }, ref) => (
    <fieldset data-testid={dataTestId} ref={ref} {...rest}>
      {label && <Label required={required}>{label}</Label>}
      {children}
    </fieldset>
  )
);

FieldGroup.displayName = 'FieldGroup';
