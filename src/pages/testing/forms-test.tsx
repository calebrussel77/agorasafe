import { ProfileType } from '@prisma/client';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Redirect } from '@/components/redirect';
import { Card } from '@/components/ui/card';
import { CenterContent } from '@/components/ui/layout';
import { Seo } from '@/components/ui/seo';
import { useToast } from '@/components/ui/toast';

import {
  AddProfileForm,
  type AddProfileFormData,
  useCreateProfile,
} from '@/features/profiles';

import { wait } from '@/utils/misc';
import { getProfileTypeName } from '@/utils/profile';

import { htmlParse } from '@/lib/html-react-parser';

import { useCurrentUser } from '@/hooks/use-current-user';

const ALLOWED_TYPES = Object.keys(ProfileType);

const meta = {
  title: (profileType: ProfileType) =>
    `Ajouter un profil ${getProfileTypeName(profileType).toLowerCase()}`,
  description: `Renseignez les informations ci-dessous pour facilement gérer vos
  projets, consulter vos candidatures, rechercher des prestataires
  ou des demandes de service, etc.`,
};

const FormsTestPage = () => {
  const router = useRouter();
  const profileType = router.query.profile_type as ProfileType;
  const { resetProfile } = useCurrentUser();
  const { toast } = useToast();

  const { mutate, error, isLoading } = useCreateProfile({
    async onSuccess(data) {
      toast({
        variant: 'success',
        title: htmlParse(data.message) as never,
      });
      resetProfile();
      await wait(3_00);
      void router.push('/');
    },
  });

  const onRegister = (data: AddProfileFormData) => {
    mutate({
      ...data,
    });
  };

  if (router.isReady && !ALLOWED_TYPES.includes(profileType)) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Seo title={meta.title(profileType)} description={meta.description} />
      <CenterContent className="container min-h-screen w-full max-w-2xl">
        <div>
          <Link href="/" className="mb-6 flex items-center gap-2">
            <MoveLeft className="h-5 w-5" />
            <span>Retour</span>
          </Link>
          <Card>
            <Card.Header>
              <Card.Title className="text-xl">
                {meta.title(profileType)}
              </Card.Title>
              <Card.Description>{meta.description}</Card.Description>
            </Card.Header>
            <Card.Content>
              <AddProfileForm
                onSubmit={onRegister}
                error={error}
                isLoading={isLoading}
                selectedProfile={profileType}
              />
            </Card.Content>
          </Card>
        </div>
      </CenterContent>
    </>
  );
};

export default FormsTestPage;
