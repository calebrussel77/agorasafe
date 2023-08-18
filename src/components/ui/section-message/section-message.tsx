import { type VariantProps, cva } from 'class-variance-authority';
import {
  AlertTriangle,
  HelpCircle,
  InfoIcon,
  MailQuestion,
  X,
} from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';
import React, { type ReactElement, forwardRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { AutoAnimate } from '../auto-animate';
import { Inline } from '../inline';
import { MessageAction } from './section-message-action';

const sectionMessage = cva('w-full flex justify-center items-start gap-2', {
  variants: {
    appareance: {
      danger: [
        'bg-red-50 text-red-800 border-b border-t border-red-500',
        // 'border-transparent',
      ],
      discovery: [
        'bg-pink-600 text-white border-b border-t border-pink-500',
        // 'border-transparent',
      ],
      success: [
        'bg-green-50 text-green-800 border-b border-t border-green-500',
        // 'border-transparent',
      ],
      warning: [
        'bg-yellow-50 text-yellow-800 border-b border-t border-yellow-500',
      ],
      info: ['bg-blue-50 text-brand-800 border-b border-t border-brand-500'],
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

type SectionMessageOptions = {
  className?: string;
  isSticky?: boolean;
  title?: string | ReactElement;
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  actions?: Array<ReactElement<unknown>> | ReactElement<unknown>;
  hasCloseButton?: boolean;
};

const IconAppareances = {
  danger: {
    icon: InfoIcon,
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
  info: { icon: InfoIcon, color: 'text-primary-500' },
};

export type SectionMessageProps = VariantProps<typeof sectionMessage> &
  SectionMessageOptions & { description?: string | JSX.Element };

const SectionMessage = forwardRef<HTMLDivElement, SectionMessageProps>(
  (
    {
      className,
      appareance,
      onClose,
      hasCloseButton = true,
      size,
      title,
      isSticky = false,
      actions,
      description,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(true);
    const isActionsArray = Array.isArray(actions);

    const Icon =
      appareance && IconAppareances[appareance]
        ? IconAppareances[appareance]['icon']
        : MailQuestion;

    const ColorIcon =
      appareance && IconAppareances[appareance]
        ? IconAppareances[appareance]['color']
        : '';

    const toggleVisible = () => setIsVisible(false);

    return (
      <AutoAnimate>
        {isVisible && (
          <div
            ref={ref}
            role="alert"
            className={cn(
              'mb-3',
              sectionMessage({ appareance, size, class: className }),
              isSticky && 'sticky top-0 z-20 w-full'
            )}
            {...props}
          >
            <div className="flex w-full flex-1 items-start gap-3">
              {<Icon className={`h-6 w-6 flex-shrink-0 ${ColorIcon}`} />}
              <div className="space-y-2">
                {title && <h3 className="text-base font-semibold">{title}</h3>}
                {description && <div className="text-sm">{description}</div>}
                <div className="flex flex-wrap items-center gap-1">
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
                className="transform p-1 transition duration-150 hover:scale-105"
              >
                <X className="h-5 w-5 flex-shrink-0" />
              </button>
            )}
          </div>
        )}
      </AutoAnimate>
    );
  }
);

SectionMessage.displayName = 'SectionMessage';

export { SectionMessage, MessageAction as SectionMessageAction };
