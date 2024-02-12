import * as React from 'react';

import { type Variant, getVariantBorderColor } from '@/utils/variants';

import { cn } from '@/lib/utils';

import { useMergeRefs } from '@/hooks/use-merge-refs';

import { CloseButton } from '../close-button';
import { Spinner } from '../spinner';

type ClassNames = {
  root: string;
  input: string;
};

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  loading?: boolean;
  variant?: Variant;
  autoFocus?: boolean;
  iconBefore?: React.ReactNode;
  iconAfter?: React.ReactNode;
  isFullWidth?: boolean;
  isClearable?: boolean;
  classNames?: Partial<ClassNames>;
  onClear?: () => void;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant,
      iconBefore,
      iconAfter,
      disabled,
      loading,
      classNames,
      isFullWidth = true,
      isClearable = true,
      onClear,
      ...props
    },
    ref
  ) => {
    const hasElementAfter = iconAfter || loading || isClearable;
    const hasError = variant === 'danger';
    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = useMergeRefs(ref, inputRef) as unknown;

    const closeButton = props.value && type !== 'hidden' && (
      <CloseButton
        variant="transparent"
        onClick={() => {
          // eslint-disable-next-line @typescript-eslint/unbound-method
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value'
          )?.set;
          nativeInputValueSetter?.call(inputRef.current, '');

          const ev2 = new Event('input', { bubbles: true });
          inputRef.current?.dispatchEvent(ev2);
          onClear?.();
        }}
      />
    );

    return (
      <div
        className={cn(
          'relative',
          isFullWidth ? 'w-full flex-1' : 'w-fit',
          classNames?.root
        )}
      >
        {iconBefore && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            {iconBefore}
          </div>
        )}
        <input
          style={hasError ? { borderColor: 'red' } : {}}
          aria-invalid={hasError ? 'true' : 'false'}
          type={type}
          disabled={disabled || loading}
          className={cn(
            'flex h-10 w-full rounded-sm border border-input bg-transparent px-3 py-2 text-sm ring-offset-background transition duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            variant && getVariantBorderColor(variant),
            iconBefore && 'pl-10',
            hasElementAfter && 'pr-10',
            classNames?.input,
            className
          )}
          ref={mergedRef as React.RefObject<HTMLInputElement>}
          {...props}
        />

        {hasElementAfter && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            {loading ? (
              <Spinner variant="ghost" size="md" aria-hidden="true" />
            ) : (
              <div className="flex items-center gap-4">
                {isClearable && closeButton}
                {iconAfter}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
