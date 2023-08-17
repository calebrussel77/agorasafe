import { type ToastOptions, toast as reactToastifyToast } from 'react-toastify';

import {
  Notification,
  type NotificationGlobalProps,
} from '@/components/ui/notification';

type UseToastMessageProps = Pick<
  NotificationGlobalProps,
  'variant' | 'title' | 'description' | 'actions' | 'onClose' | 'size' | 'icon'
> & { toastOptions?: ToastOptions };

export const useToastMessage = () => {
  const toast = ({ toastOptions, ...rest }: UseToastMessageProps) => {
    return reactToastifyToast(<Notification {...rest} />, toastOptions);
  };

  return { toast };
};
