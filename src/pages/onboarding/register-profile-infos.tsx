import { ProfileType } from '@prisma/client';
import { MoveLeft } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { type Session } from 'next-auth';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Redirect } from '@/components/redirect';
import { Card } from '@/components/ui/card';
import { CenterContent } from '@/components/ui/layout';
import { Seo } from '@/components/ui/seo';

import {
  AuthRegisterInfosForm,
  type AuthRegisterInfosFormData,
  useUserRegister,
} from '@/features/auth-onboarding';

import { requireAuth } from '@/utils/require-auth';

import { htmlParse } from '@/lib/html-react-parser';

import { useToastMessage } from '@/hooks/use-toast-message';

const ALLOWED_TYPES = Object.keys(ProfileType);
const meta = {
  title: 'Informations du profil',
  description: `  Renseignez les informations ci-dessous pour facilement gérer vos
  projets, consulter vos candidatures, rechercher des prestataires
  ou des demandes de service, etc.`,
};

const RegisterProfileInfosPage = () => {
  const router = useRouter();
  const profileType = router.query.profile_type as ProfileType;
  const { toast } = useToastMessage();

  const { mutate, error, isLoading } = useUserRegister({
    onSuccess(data) {
      toast({
        variant: 'success',
        title: htmlParse(data.message) as never,
      });
      void router.push(data.redirectUrl);
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
    <>
      <Seo title={meta.title} description={meta.description} />

      <CenterContent className="container min-h-screen w-full max-w-2xl">
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
              <Card.Title>{meta.title}</Card.Title>
              <Card.Description>{meta.description}</Card.Description>
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
      </CenterContent>
    </>
  );
};

export default RegisterProfileInfosPage;

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
