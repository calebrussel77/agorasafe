import { type InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { z } from 'zod';

import { CenterContent } from '@/components/ui/layout';
import { Seo } from '@/components/ui/seo';
import { Typography } from '@/components/ui/typography';

import { createServerSideProps } from '@/server/utils/server-side';

const meta = {
  title: (profileName: string) => `${profileName} - Profil personnel`,
  description: `Renseignez les informations ci-dessous pour facilement gérer vos
    projets, consulter vos candidatures, rechercher des prestataires
    ou des demandes de service, etc.`,
};

const ProfileDetailsPage = ({
  profile,
  profileSlugQuery,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  return (
    <>
      <Seo title={meta.title(profile?.name)} description={meta.description} />
      <CenterContent className="container w-full min-w-[38rem] max-w-2xl pb-12">
        <div className="w-full">
          <Typography as="h1" variant="h4" className="pb-6 text-brand-600">
            Étape {profileSlugQuery}
          </Typography>
        </div>
      </CenterContent>
    </>
  );
};

const querySchema = z.object({
  profileSlug: z.string(),
});

export const getServerSideProps = createServerSideProps({
  resolver: ({ ctx, profile }) => {
    const result = querySchema.safeParse(ctx.query);

    if (!result.success || !profile) return { notFound: true };

    const profileSlugQuery = result.data.profileSlug;

    return { props: { profileSlugQuery, profile } };
  },
});

export default ProfileDetailsPage;
