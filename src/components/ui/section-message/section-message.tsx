import { type VariantProps, cva } from 'class-variance-authority';
import { AlertTriangle, HelpCircle, Info, MailQuestion, X } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';
import React, { type ReactElement, forwardRef, useState } from 'react';

import { Animate } from '../animate';
import { Inline } from '../inline';
import { MessageAction } from './section-message-action';

const sectionMessage = cva('w-full flex justify-center items-start gap-2', {
  variants: {
    appareance: {
      danger: [
        'bg-red-50 text-red-800',
        // 'border-transparent',
      ],
      discovery: [
        'bg-secondary-600 text-white',
        // 'border-transparent',
      ],
      success: [
        'bg-green-50 text-green-800',
        // 'border-transparent',
      ],
      warning: ['bg-yellow-50 text-yellow-800'],
      info: ['bg-blue-50 text-blue-800'],
      system: ['bg-primary-50 text-primary-800'],
    },
    size: {
      small: ['text-sm', 'py-1.5', 'px-4'],
      medium: ['text-base', 'py-2', 'px-4'],
      large: ['text-lg', 'py-3', 'px-6'],
    },
  },
  compoundVariants: [{ appareance: 'danger', size: 'medium' }],
  defaultVariants: {
    appareance: 'danger',
    size: 'medium',
  },
});

type otherProps = {
  className?: string;
  title?: string | ReactElement;
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  actions?: Array<ReactElement<unknown>> | ReactElement<unknown>;
  hasCloseButton?: boolean;
};

const IconAppareances = {
  danger: {
    icon: Info,
    color: ' text-red-500',
  },
  success: {
    icon: CheckCircle2,
    color: ' text-green-500',
  },
  discovery: {
    icon: HelpCircle,
    color: 'text-white',
  },
  system: {
    icon: CheckCircle2,
    color: 'text-primary-500',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-500',
  },
  info: { icon: Info, color: 'text-primary-500' },
};

export type SectionMessageProps = VariantProps<typeof sectionMessage> &
  otherProps &
  React.HTMLAttributes<HTMLDivElement>;

const SectionMessage = forwardRef<HTMLDivElement, SectionMessageProps>(
  (
    {
      className,
      appareance,
      onClose,
      hasCloseButton = true,
      size,
      title,
      actions,
      children,
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = useState(true);
    const isActionsArray = Array.isArray(actions);

    const Icon =
      appareance && IconAppareances[appareance]
        ? IconAppareances[appareance]['icon']
        : MailQuestion;

    const ColorIcon =
      appareance && IconAppareances[appareance]
        ? IconAppareances[appareance]['color']
        : '';

    const toggleVisible = () => setVisible(false);

    return (
      <Animate>
        {visible && (
          <div
            ref={ref}
            className={sectionMessage({ appareance, size, class: className })}
            {...props}
          >
            <div className="flex items-start gap-3 flex-1 w-full">
              {<Icon className={`h-6 w-6 flex-shrink-0 ${ColorIcon}`} />}
              <div className="space-y-2">
                {title && <h3 className="font-semibold text-base">{title}</h3>}
                {children && <div className="text-sm">{children}</div>}
                <div className="flex items-center flex-wrap gap-1">
                  {isActionsArray
                    ? actions?.length > 0 && (
                        <Inline
                          divider={
                            <span className="text-blue-100">&middot;</span>
                          }
                          className="gap-1"
                        >
                          {actions}
                        </Inline>
                      )
                    : actions}
                </div>
              </div>
            </div>
            {hasCloseButton && (
              <button
                type="button"
                onClick={onClose || toggleVisible}
                className="p-1 transform hover:scale-105 transition duration-150"
              >
                <X className="h-5 w-5 flex-shrink-0" />
              </button>
            )}
          </div>
        )}
      </Animate>
    );
  }
);

SectionMessage.displayName = 'SectionMessage';

export { SectionMessage, MessageAction as SectionMessageAction };
