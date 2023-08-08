import { ProfileType } from '@prisma/client';
import { MoveLeft } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { type Session } from 'next-auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
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

import { htmlParse } from '@/lib/html-react-parser';

const ALLOWED_TYPES = Object.keys(ProfileType);

const RegisterInfosPage = () => {
  const router = useRouter();
  const profileType = router.query.profile_type as ProfileType;

  const { mutate, error, isLoading } = useUserRegister({
    onSuccess(data) {
      toast(
        <Notification
          variant="success"
          className="text-sm"
          title={htmlParse(data.message) as never}
        />
      );
      wait(3_00)
        .then(() => {
          window.location.href = data.redirectUri;
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
      profileType: profileType,
    });
  };

  if (router.isReady && !ALLOWED_TYPES.includes(profileType)) {
    return <Redirect to="/choose-profile-type" />;
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
            <Card.Title>Informations du profil</Card.Title>
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
