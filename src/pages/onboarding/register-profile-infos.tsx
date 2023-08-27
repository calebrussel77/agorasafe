import { ProfileType } from '@prisma/client';
import { MoveLeft } from 'lucide-react';
import { useRouter } from 'next/router';

import { Card } from '@/components/ui/card';
import { CenterContent } from '@/components/ui/layout';
import { Seo } from '@/components/ui/seo';
import { useToast } from '@/components/ui/toast';

import {
  AuthRegisterInfosForm,
  type AuthRegisterInfosFormData,
  useUserRegister,
} from '@/features/auth-onboarding';

import { htmlParse } from '@/lib/html-react-parser';

import { useCurrentUser } from '@/hooks/use-current-user';

const meta = {
  title: 'Informations du profil',
  description: `Renseignez les informations ci-dessous pour facilement gérer vos
  projets, consulter vos candidatures, rechercher des prestataires
  ou des demandes de service, etc.`,
};

const RegisterProfileInfosPage = () => {
  const router = useRouter();
  const { updateUser, session } = useCurrentUser();
  const profileType = router.query.profile_type as ProfileType;
  const { toast } = useToast();

  const { mutate, error, isLoading } = useUserRegister({
    async onSuccess(data) {
      await updateUser({
        ...session,
        user: { ...session?.user, hasBeenOnboarded: true },
      });
      toast({
        variant: 'success',
        title: htmlParse(data.message) as never,
      });
      void router.push(
        profileType === ProfileType.CUSTOMER
          ? '/publish-service/amenagement-salle-de-bain'
          : '/'
      );
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
      profileType,
    });
  };

  return (
    <>
      <Seo title={meta.title} description={meta.description} />

      <CenterContent className="container min-h-screen w-full max-w-2xl">
        <div>
          <button
            onClick={router?.back}
            className="mb-6 flex items-center gap-2"
          >
            <MoveLeft className="h-5 w-5" />
            <span>Retour</span>
          </button>
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
