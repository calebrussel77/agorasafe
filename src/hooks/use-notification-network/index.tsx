import { Wifi, WifiOff } from 'lucide-react';
import { useEffect } from 'react';
import { useNetworkState } from 'react-use';

import { ToastAction, useToast } from '@/components/ui/toast';

const useNotificationNetwork = () => {
  const state = useNetworkState();
  const { toast } = useToast();

  useEffect(() => {
    if (state?.online && state.previous === false) {
      toast({
        icon: <Wifi className="h-5 w-5" />,
        variant: 'success',
        title: 'Votre connexion internet a été rétablie.',
        actions: [
          <ToastAction key="hs" altText="cancel" variant="outline">
            Cancel
          </ToastAction>,
          <ToastAction key="kks" altText="Valider">
            Valider
          </ToastAction>,
        ],
      });
    }
    if (state.previous && state?.online === false) {
      toast({
        icon: <WifiOff className="h-5 w-5" />,
        variant: 'warning',
        title: 'Vous êtes actuellement hors ligne.',
        actions: <ToastAction altText="Valider">Valider</ToastAction>,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.online, state.previous]);
};

export { useNotificationNetwork };
