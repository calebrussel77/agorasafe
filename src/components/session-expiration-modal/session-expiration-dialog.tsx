import { REDIRECT_QUERY_KEY } from '@/constants';
import { type ProfileStore } from '@/stores/profiles';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { LoginRedirect } from '@/features/auth';

import { generateUrlWithSearchParams } from '@/utils/misc';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

function SessionExpirationDialog({
  updateIsSessionExpired,
}: {
  updateIsSessionExpired: ProfileStore['setIsSessionExpired'];
}) {
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader shouldHideCloseButton>
          <DialogTitle>
            <span>Session expirée : Veuillez vous reconnecter</span>
          </DialogTitle>
          <DialogDescription>
            Votre session a expiré par mesure de sécurité. Veuillez vous
            reconnecter pour continuer à accéder à votre compte. Nous vous
            invitons à saisir vos informations d'identification pour reprendre
            là où vous vous étiez arrêté. Si vous avez des questions ou des
            préoccupations, n'hésitez pas à nous contacter.
          </DialogDescription>
        </DialogHeader>
        <div className="flex w-full justify-end px-4 py-3">
          <LoginRedirect
            reason="session-expired"
            onRedirect={() => updateIsSessionExpired(false)}
          >
            <Button>Me reconnecter</Button>
          </LoginRedirect>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { SessionExpirationDialog };
