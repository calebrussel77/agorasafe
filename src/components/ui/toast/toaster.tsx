import { cn } from '@/lib/utils';

import { Inline } from '../inline';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastIcon,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast';
import { useToast } from './use-toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        actions,
        icon,
        variant,
        ...props
      }) {
        const isActionsArray = Array.isArray(actions);
        const hasOneAction = !isActionsArray || actions.length === 1;
        const isTitleString = typeof title === 'string';
        const isDescriptionString = typeof description === 'string';

        return (
          <Toast
            className={cn(hasOneAction && 'flex items-center')}
            key={id}
            {...props}
          >
            <ToastIcon icon={icon} variant={variant} />
            <div
              className={cn(
                'ml-3 flex w-0 flex-1 flex-col space-y-2',
                hasOneAction && 'flex-row items-center space-x-2'
              )}
            >
              <div className="grid gap-1">
                {isTitleString ? <ToastTitle>{title}</ToastTitle> : title}
                {isDescriptionString ? (
                  <ToastDescription>{description}</ToastDescription>
                ) : (
                  description
                )}
              </div>
              <Inline className="gap-x-1.5">{actions}</Inline>
            </div>
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
