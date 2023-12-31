import { type VariantProps, cva } from 'class-variance-authority';
import {
  AlertTriangle,
  HelpCircle,
  InfoIcon,
  MailQuestion,
  ShieldCheckIcon,
  X,
} from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';
import React, { type ReactElement, forwardRef, useState } from 'react';

import { isArray } from '@/utils/type-guards';

import { cn } from '@/lib/utils';

import { AutoAnimate } from '../auto-animate';
import { Inline } from '../inline';
import { MessageAction } from './section-message-action';

const sectionMessage = cva('w-full flex justify-center items-start gap-2', {
  variants: {
    appareance: {
      danger: [
        'bg-red-600 text-white',
        // 'border-transparent',
      ],
      discovery: [
        'bg-pink-600 text-white',
        // 'border-transparent',
      ],
      success: [
        'bg-green-600 text-white',
        // 'border-transparent',
      ],
      warning: ['bg-yellow-600 text-white'],
      info: ['bg-brand-600 text-white'],
      system: ['bg-gradient-to-bl to-brand-600 from-purple-400 text-white'],
    },
    size: {
      small: ['text-sm', 'py-2.5', 'px-4'],
      medium: ['text-base', 'py-2', 'px-4'],
      large: ['text-lg', 'py-3', 'px-6'],
    },
  },
  compoundVariants: [{ appareance: 'danger', size: 'medium' }],
  defaultVariants: {
    appareance: 'danger',
    size: 'small',
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
    color: ' text-white',
  },
  success: {
    icon: CheckCircle2,
    color: ' text-white',
  },
  discovery: {
    icon: HelpCircle,
    color: 'text-white',
  },
  system: {
    icon: ShieldCheckIcon,
    color: 'text-white',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-white',
  },
  info: { icon: InfoIcon, color: 'text-white' },
};

export type SectionMessageProps = VariantProps<typeof sectionMessage> &
  SectionMessageOptions & { description?: string | JSX.Element };

const SectionMessage = forwardRef<HTMLDivElement, SectionMessageProps>(
  (
    {
      className,
      appareance = 'danger',
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
    const isActionsArray = isArray(actions);

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
      <>
        {isVisible && (
          <div
            ref={ref}
            role="alert"
            className={cn(
              'mb-3 rounded-sm',
              sectionMessage({ appareance, size, class: className }),
              isSticky && 'sticky top-0 z-40 w-full'
            )}
            {...props}
          >
            <div className="flex w-full flex-1 items-center gap-3">
              {<Icon className={`h-6 w-6 flex-shrink-0 ${ColorIcon}`} />}
              <div className="space-y-2">
                {title && <h3 className="text-sm font-semibold">{title}</h3>}
                {description && (
                  <div className="text-sm opacity-80">{description}</div>
                )}
                {isActionsArray
                  ? actions?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1">
                        <Inline
                          divider={
                            <span className="text-brand-100">&middot;</span>
                          }
                          className="gap-1"
                        >
                          {actions}
                        </Inline>
                      </div>
                    )
                  : actions}
              </div>
            </div>
            {hasCloseButton && (
              <button
                type="button"
                onClick={onClose || toggleVisible}
                className="transform p-1 transition duration-150 hover:scale-105"
              >
                <X className="h-4 w-4 flex-shrink-0" />
              </button>
            )}
          </div>
        )}
      </>
    );
  }
);

SectionMessage.displayName = 'SectionMessage';

export { SectionMessage, MessageAction as SectionMessageAction };
