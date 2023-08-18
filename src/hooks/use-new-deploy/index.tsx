import { useHasNewDeploy } from 'next-deploy-notifications';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

import { useToastMessage } from '../use-toast-message';

const useNewDeploy = () => {
  const { hasNewDeploy } = useHasNewDeploy({
    interval: 15_000,
  });
  const { toast } = useToastMessage();
  const { reload } = useRouter();

  useEffect(() => {
    if (hasNewDeploy) {
      toast({
        variant: 'info',
        title: "Une nouvelle version de l'application est disponible.",
        actions: (
          <Button size="sm" onClick={reload} className="whitespace-nowrap">
            Recharger votre page
          </Button>
        ),
        toastOptions: { autoClose: false, position: 'top-center' },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNewDeploy]);
};

export { useNewDeploy };
