/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-argument */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable no-undef */
import { Fragment, forwardRef, useId } from 'react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import { wrapChildren } from '@/utils/wrap-children';

import { cn } from '@/lib/utils';

import { HelperMessage } from '../helper-message/helper-message';
import { Label } from '../label';
import { RowContainer } from '../layout';
import { VariantMessage } from '../variant-message/variant-message';
import { getBaseType, getVariant } from './utils';

export interface FieldOptions {
  children: JSX.Element;
  disabled?: boolean;
  disabledIcon?: JSX.Element;
  label?: string | JSX.Element;
  description?: string;
  required?: boolean;
  loading?: boolean;
  error?: string | JSX.Element;
  warning?: string | JSX.Element;
  success?: string | JSX.Element;
  info?: string | JSX.Element;
  hint?: string;
  className?: string;
  labelClassName?: string;
  id?: string;
}

export type FieldProps = FieldOptions;

export const Field = forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      children,
      disabled,
      disabledIcon,
      label,
      error: danger,
      warning,
      info,
      success,
      loading,
      required,
      hint,
      labelClassName,
      className,
      description,
      id,
    },
    ref
  ) => {
    const generatedId = useId();
    const form = useFormContext();
    const state = form?.getFieldState(children.props.name, form.formState);

    const baseType = getBaseType(
      children.props.type || children.type.displayName
    );
    const isCheckbox = baseType === 'checkbox';
    const isRadio = baseType === 'radio';
    const isRadioGroupItem = baseType === 'RadioGroupItem';

    const isCheckable = isRadio || isCheckbox || isRadioGroupItem;

    const layout = isCheckable ? 'flex-row' : 'flex-col';

    const Container = layout === 'flex-row' ? RowContainer : Fragment;

    const htmlFor =
      id ||
      children.props.id ||
      children.props.name ||
      `${baseType}--${generatedId}`;

    const hasHintText = !!hint;

    const infoText = info && wrapChildren(info);
    const errorText = danger && wrapChildren(danger);
    const warningText = warning && wrapChildren(warning);
    const successText = success && wrapChildren(success);

    const hasError = errorText || state?.error;
    const combinedErrorText = errorText || state?.error?.message;

    const hasVariantMessage =
      successText || warningText || combinedErrorText || infoText;

    const variant = getVariant({ danger, warning, success, info });

    const child = React.cloneElement(React.Children.only(children), {
      disabled,
      id: htmlFor,
      required,
      variant: hasError ? 'danger' : variant,
      loading,
    });

    return (
      <div ref={ref} className={cn('flex flex-col gap-0.5', className)}>
        <>
          <Container>
            {label && (
              <Label
                disabled={disabled}
                disabledIcon={disabledIcon}
                variant={hasError ? 'danger' : variant}
                htmlFor={htmlFor}
                required={required}
                withDisabledIcon={!isCheckable}
                className={cn(
                  'font-semibold',
                  layout === 'flex-row' ? 'flex flex-row items-center' : '',
                  labelClassName
                )}
              >
                {isCheckable && child}
                {label}
              </Label>
            )}
            {!isCheckable && child}
          </Container>
          <div className="flex w-full items-center justify-between">
            <div>
              {hasHintText && !hasVariantMessage && (
                <HelperMessage className="mt-0.5">{hint}</HelperMessage>
              )}

              {successText && (
                <VariantMessage variant="success">{successText}</VariantMessage>
              )}
              {hasError && (
                <VariantMessage variant="danger">
                  {combinedErrorText}
                </VariantMessage>
              )}
              {infoText && (
                <VariantMessage variant="info">{infoText}</VariantMessage>
              )}

              {warningText && (
                <VariantMessage variant="warning">{warningText}</VariantMessage>
              )}
            </div>
            {description && (
              <div className="ml-1 text-sm text-muted-foreground">
                {description}
              </div>
            )}
          </div>
        </>
      </div>
    );
  }
);

Field.displayName = 'Field';
