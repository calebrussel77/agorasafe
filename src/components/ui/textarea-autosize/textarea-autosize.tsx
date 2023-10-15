import * as React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { type Variant, getVariantBorderColor } from '@/utils/variants';

import { cn } from '@/lib/utils';

import { useFocus } from '@/hooks/use-focus';
import { useMergeRefs } from '@/hooks/use-merge-refs';

export type TextareaAutosizeProps = React.ComponentProps<
  typeof TextareaAutosize
> & {
  loading?: boolean;
  variant?: Variant;
  autoFocus?: boolean;
};

const TextareaAutosizeComp = React.forwardRef<
  HTMLTextAreaElement,
  TextareaAutosizeProps
>(
  (
    { className, variant, autoFocus, maxRows = 4, onKeyDown, ...props },
    ref
  ) => {
    const { elementRef } = useFocus(autoFocus);
    const refs = useMergeRefs(elementRef, ref);
    const hasError = variant === 'danger';

    return (
      <TextareaAutosize
        style={hasError ? { borderColor: 'red' } : {}}
        aria-invalid={hasError ? 'true' : 'false'}
        className={cn(
          'word-breaks flex h-10 w-full resize-none rounded-sm border border-input bg-transparent px-3 py-2 text-sm ring-offset-background transition duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          variant && getVariantBorderColor(variant),
          className
        )}
        onKeyDown={onKeyDown}
        maxRows={maxRows}
        ref={refs}
        {...props}
      />
    );
  }
);

TextareaAutosizeComp.displayName = 'Textarea';

export { TextareaAutosizeComp as TextareaAutosize };
