import { MoveLeft } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { type Session } from 'next-auth';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { GoogleSolidIcon } from '@/components/icons/google-solid-icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { useAuth } from '@/features/auth';

import { handleRouteBack } from '@/utils/handle-route-back';

import { htmlParse } from '@/lib/html-react-parser';

import { getUserById } from '@/server/api/modules/users';
import { getServerAuthSession } from '@/server/auth';

import { useRedirectUrl } from '@/hooks/use-redirect-url';
import { useToastMessage } from '@/hooks/use-toast-message';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToastMessage();
  const { redirectUrl } = useRedirectUrl(router);
  const { onGooleSignIn } = useAuth();

  const onRegisterWithGoogle = async () => {
    setIsLoading(true);
    await onGooleSignIn({
      redirectUrl,
      onError(error) {
        const errorMessage =
          error instanceof Error ? error.message : "Une erreur s'est produite";
        toast({
          variant: 'danger',
          title: htmlParse(errorMessage),
        });
      },
      onSeatled() {
        setTimeout(() => setIsLoading(false), 4000);
      },
    });
  };

  return (
    <div className="container flex min-h-screen w-full max-w-xl flex-col items-center justify-center">
      <div>
        <button
          onClick={() => handleRouteBack({ router })}
          className="mb-6 flex items-center gap-2"
        >
          <MoveLeft className="h-5 w-5" />
          <span>Retour</span>
        </button>
        <Card className="m-auto w-full max-w-xl">
          <Card.Header>
            <Card.Title className="text-xl">Se connecter</Card.Title>
            <Card.Description>
              Rejoignez notre communauté florissante de talents et de clients au
              Cameroun et découvrez un monde de possibilités et de réussite.
              Inscrivez-vous ou Connectez-vous dès aujourd'hui et faites partie
              de notre aventure passionnante !
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <Separator />
            <Button
              isLoading={isLoading}
              onClick={() => void onRegisterWithGoogle()}
              className="mt-6 flex w-full items-center justify-center font-semibold"
            >
              <GoogleSolidIcon className="h-5 w-5" />
              <span>Accéder à mon compte avec Google</span>
            </Button>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<
  | {
      session: Session;
    }
  | object
> = async ctx => {
  const session = await getServerAuthSession(ctx);

  if (session) {
    // find user in db by id
    const userFounded = await getUserById(session.user.id);

    // redirect to account type selection page if user doesn't have at least one profile
    if (userFounded?._count?.profiles === 0) {
      return {
        redirect: {
          destination: '/choose-profile-type',
          permanent: false,
        },
      };
    }
    // otherwise redirect to home page
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default LoginPage;
