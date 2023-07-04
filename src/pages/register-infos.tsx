import { MainLayout } from '@/layouts';
import { ProfileType } from '@prisma/client';
import { MoveLeft } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { type Session } from 'next-auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { type ReactElement } from 'react';
import { toast } from 'react-toastify';

import { Redirect } from '@/components/redirect';
import { Card } from '@/components/ui/card';
import { Notification } from '@/components/ui/notification';

import {
  AuthRegisterInfosForm,
  type AuthRegisterInfosFormData,
  useUserRegister,
} from '@/features/auth-onboarding';

import { wait } from '@/utils/misc';
import { requireAuth } from '@/utils/require-auth';

const ALLOWED_TYPES = Object.keys(ProfileType);

const meta = {
  title: `Renseignez mes informations de profile`,
};

const RegisterInfosPage = () => {
  const router = useRouter();
  const { profile_type } = router.query;

  const { mutate, error, isLoading } = useUserRegister({
    onSuccess(data) {
      toast(<Notification variant="success" title={data.message} />);
      wait(3_00)
        .then(() => {
          void router.replace(data.redirect_uri);
        })
        .catch(e => console.log(e));
    },
  });

  const onRegister = (data: AuthRegisterInfosFormData) => {
    mutate({
      location: {
        name: data.location.value,
        wikidata: data.location.wikidata,
        lat: String(data.location.lat),
        long: String(data.location.long),
      },
      phone: data.phone,
      profile_type: profile_type as ProfileType,
    });
  };

  if (router.isReady && !ALLOWED_TYPES.includes(profile_type as ProfileType)) {
    return <Redirect to="/choose-account-type" />;
  }

  return (
    <div className="container flex min-h-screen w-full max-w-xl flex-col items-center justify-center">
      <div>
        <Link
          href="/choose-profile-type"
          className="mb-6 flex items-center gap-2"
        >
          <MoveLeft className="h-5 w-5" />
          <span>Retour</span>
        </Link>
        <Card>
          <Card.Header>
            <Card.Title className="text-xl">Informations du profile</Card.Title>
            <Card.Description>
              Renseignez les informations ci-dessous pour facilement gérer vos
              projets, consulter vos candidatures, rechercher des prestataires
              ou des demandes de service, etc.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <AuthRegisterInfosForm
              onSubmit={onRegister}
              error={error}
              isLoading={isLoading}
            />
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{
  session: Session;
}> = async ctx => {
  return requireAuth({
    ctx,
    cb({ session }) {
      return {
        props: { session },
      };
    },
  });
};

export default RegisterInfosPage;
