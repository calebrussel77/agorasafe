import { ProfileType } from '@prisma/client';
import { MoveLeft } from 'lucide-react';
import { type InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { z } from 'zod';

import { Card } from '@/components/ui/card';
import { CenterContent } from '@/components/ui/layout';
import { Seo } from '@/components/ui/seo';

import {
  type CreateNewProfileInput,
  CreateProfileForm,
  useCreateProfile,
} from '@/features/profiles';

import { getProfileTypeName } from '@/utils/profile';

import { createServerSideProps } from '@/server/utils/server-side';

import { useCurrentUser } from '@/hooks/use-current-user';

const meta = {
  title: (profileType: ProfileType) =>
    `Ajouter un profil ${getProfileTypeName(profileType).toLowerCase()}`,
  description: `Renseignez les informations ci-dessous pour facilement gérer vos
  projets, consulter vos candidatures, rechercher des prestataires
  ou des demandes de service, etc.`,
};

export default function AddNewProfilePage({
  profileTypeQuery,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { resetProfile, updateUser, session } = useCurrentUser();

  const { mutate, error, isLoading } = useCreateProfile({
    async onSuccess(data) {
      await updateUser({
        user: { ...session?.user, hasBeenOnboarded: true },
      });
      void router.push('/');
      resetProfile();
    },
  });

  const onRegister = (data: CreateNewProfileInput) => {
    mutate({
      name: data.name,
      phone: data.phone,
      profileType: data.profileType,
      location: {
        lat: data.location.lat,
        long: data.location.long,
        name: data.location.value,
        wikidata: data.location.wikidata,
      },
    });
  };

  return (
    <>
      <Seo
        title={meta.title(profileTypeQuery)}
        description={meta.description}
      />
      <CenterContent className="container min-h-screen w-full max-w-2xl">
        <div>
          <button
            onClick={router.back}
            className="mb-6 flex items-center gap-2"
          >
            <MoveLeft className="h-5 w-5" />
            <span>Retour</span>
          </button>
          <Card>
            <Card.Header>
              <Card.Title className="text-xl">
                {meta.title(profileTypeQuery)}
              </Card.Title>
              <Card.Description>{meta.description}</Card.Description>
            </Card.Header>
            <Card.Content>
              <CreateProfileForm
                onSubmit={onRegister}
                error={error}
                isLoading={isLoading}
                selectedProfile={profileTypeQuery}
              />
            </Card.Content>
          </Card>
        </div>
      </CenterContent>
    </>
  );
}

const querySchema = z.object({ profile_type: z.nativeEnum(ProfileType) });

export const getServerSideProps = createServerSideProps({
  resolver: ({ ctx }) => {
    const result = querySchema.safeParse(ctx.query);
    if (!result.success) return { notFound: true };

    const profileTypeQuery = result.data.profile_type;

    return { props: { profileTypeQuery } };
  },
});