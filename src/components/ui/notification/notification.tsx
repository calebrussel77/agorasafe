import { type VariantProps, cva } from 'class-variance-authority';
import clsx from 'clsx';
import { XIcon } from 'lucide-react';
import React, {
  type ComponentPropsWithRef,
  type FC,
  type ReactElement,
  type ReactNode,
  forwardRef,
} from 'react';

import { VariantIcon } from '@/utils/variant-icons';
import { type Variant } from '@/utils/variants';

import { cn } from '@/lib/utils';

import { Inline } from '../inline';

const notificationToken = cva(
  [
    'w-full max-w-sm md:max-w-[420px] border rounded-md shadow-lg px-3 py-2 bg-white',
    'transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  ],
  {
    variants: {
      size: {
        sm: ['text-sm'],
        md: ['text-md'],
        lg: ['text-lg'],
        xl: ['text-xl'],
      },
    },
    compoundVariants: [{ size: 'md' }],
    defaultVariants: {
      size: 'md',
    },
  }
);

export type NotificationGlobalProps = VariantProps<typeof notificationToken> &
  Omit<ComponentPropsWithRef<'div'>, 'title'> & {
    variant?: Variant;
    title?: string | ReactNode;
    description?: string | ReactNode;
    icon?: ReactElement;
    onClose?: () => void;
    actions?: Array<ReactElement<unknown>> | ReactElement<unknown>;
    hasCloseButton?: boolean;
    toastProps?: unknown;
  };

const NotifBody: FC<
  Pick<NotificationGlobalProps, 'title' | 'description' | 'actions'>
> = ({ title, description, actions }) => {
  const isTitleString = typeof title === 'string';
  const isDescriptionString = typeof description === 'string';
  const isActionsArray = Array.isArray(actions);

  const hasOneAction = !isActionsArray || actions.length === 1;

  return (
    <div
      className={clsx('ml-3 w-0 flex-1', hasOneAction && 'flex items-start')}
    >
      <div>
        {isTitleString ? (
          <p className="text-sm font-medium text-gray-900">{title}</p>
        ) : (
          title
        )}
        {isDescriptionString ? (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        ) : (
          description
        )}
        <Inline className="mt-1.5 gap-3">{actions}</Inline>
      </div>
    </div>
  );
};

const CloseButton: FC<Pick<NotificationGlobalProps, 'onClose'>> = ({
  onClose,
}) => {
  return (
    <button
      type="button"
      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
      onClick={onClose}
    >
      <span className="sr-only">Close</span>
      <XIcon className="h-5 w-5" aria-hidden="true" />
    </button>
  );
};

export const Notification = forwardRef<HTMLDivElement, NotificationGlobalProps>(
  (
    {
      hasCloseButton = true,
      className,
      variant = 'info',
      onClose,
      title,
      description,
      actions,
      size,
      icon,
      ...props
    },
    ref
  ) => {
    const hasVariant = !!variant;
    const isDefault = !hasVariant && !icon;

    return (
      <div
        ref={ref}
        className={notificationToken({
          size,
          class: cn(className),
        })}
        {...props}
      >
        <div className="p-2">
          <div className="flex items-start">
            {!isDefault && (
              <VariantIcon
                icon={icon}
                variant={variant}
                className="h-6 w-6"
                aria-hidden="true"
              />
            )}
            <NotifBody
              title={title}
              description={description}
              actions={actions}
            />

            {hasCloseButton && (
              <div className="ml-4 flex flex-shrink-0">
                <CloseButton onClose={onClose} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Notification.displayName = 'Notification';
