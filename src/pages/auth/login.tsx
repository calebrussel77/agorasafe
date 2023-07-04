/* eslint-disable @next/next/no-img-element */
import { MainLayout } from '@/layouts';
import { MoveLeft } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { type Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { type ReactElement, useState } from 'react';
import { toast } from 'react-toastify';

import { GoogleSolidIcon } from '@/components/icons/google-solid-icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Notification } from '@/components/ui/notification';
import { Separator } from '@/components/ui/separator';

import { handleRouteBack } from '@/utils/handle-route-back';

import { getServerAuthSession } from '@/server/auth';
import { prisma } from '@/server/db';
import { htmlParse } from '@/lib/html-react-parser';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onRegisterWithGoogle = () => {
    setIsLoading(true);
    try {
      void signIn('google');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur s'est produite";
      toast(
        <Notification
          variant="danger"
          title={htmlParse(errorMessage) as never}
        />
      );
    } finally {
      setTimeout(() => setIsLoading(false), 2500);
    }
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
        <Card className="max-w-xl w-full m-auto">
          <Card.Header>
            <Card.Title className="text-xl">Se connecter</Card.Title>
            <Card.Description>
              {/* Connectez-vous dès maintenant pour gérer vos projets, consulter vos
          candidatures, rechercher des prestataires ou des demandes de service,
          et découvrir de nouvelles opportunités professionnelles. */}
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
              onClick={onRegisterWithGoogle}
              className="mt-6 w-full flex font-semibold items-center justify-center"
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
    const userFounded = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: { profiles: true },
    });

    // redirect to account type selection page if user doesn't have at least one profile
    if (userFounded?.profiles.length === 0) {
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
