import { useHasNewDeploy } from 'next-deploy-notifications';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

const useNewDeploy = () => {
  const { hasNewDeploy } = useHasNewDeploy({
    interval: 15_000,
  });
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (hasNewDeploy) {
      toast({
        variant: 'info',
        title: "Une nouvelle version de l'application est disponible.",
        actions: (
          <Button
            size="sm"
            // eslint-disable-next-line @typescript-eslint/unbound-method
            onClick={router.refresh}
            className="whitespace-nowrap"
          >
            Recharger votre page
          </Button>
        ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNewDeploy]);
};

export { useNewDeploy };
