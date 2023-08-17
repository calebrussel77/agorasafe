import { Wifi, WifiOff } from 'lucide-react';
import { useEffect } from 'react';
import { useNetworkState } from 'react-use';

import { useToastMessage } from '../use-toast-message';

const useNotificationNetwork = () => {
  const state = useNetworkState();
  const { toast } = useToastMessage();

  useEffect(() => {
    if (state?.online && state.previous === false) {
      toast({
        icon: <Wifi className="h-5 w-5" />,
        variant: 'success',
        title: 'Votre connexion internet a été rétablie.',
      });
    }
    if (state.previous && state?.online === false) {
      toast({
        icon: <WifiOff className="h-5 w-5" />,
        variant: 'warning',
        title: 'Vous êtes actuellement hors ligne.',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.online, state.previous]);
};

export { useNotificationNetwork };
