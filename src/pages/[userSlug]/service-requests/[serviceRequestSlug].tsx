import { type InferGetServerSidePropsType } from 'next';
import { type Session } from 'next-auth';
import { useRouter } from 'next/router';
import { z } from 'zod';

import { CenterContent } from '@/components/ui/layout';
import { Seo } from '@/components/ui/seo';
import { Typography } from '@/components/ui/typography';

import { createServerSideProps } from '@/server/utils/server-side';

const meta = {
  title: (session: Session) => `${session?.user?.name} - Demande de service`,
  description: `Renseignez les informations ci-dessous pour facilement gérer vos
    projets, consulter vos candidatures, rechercher des prestataires
    ou des demandes de service, etc.`,
};

const PublishPage = ({
  session,
  userSlugQuery,
  serviceRequestSlugQuery,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  return (
    <>
      <Seo title={meta.title(session)} description={meta.description} />
      <CenterContent className="container w-full min-w-[38rem] max-w-2xl pb-12">
        <div className="w-full">
          <Typography as="h1" variant="h4" className="pb-6 text-brand-600">
            Étape {serviceRequestSlugQuery}
          </Typography>
        </div>
      </CenterContent>
    </>
  );
};

const querySchema = z.object({
  userSlug: z.string(),
  serviceRequestSlug: z.string().optional(),
});

export const getServerSideProps = createServerSideProps({
  shouldUseSession: true,
  resolver: ({ ctx, session }) => {
    const result = querySchema.safeParse(ctx.query);

    if (!result.success) return { notFound: true };

    const userSlugQuery = result.data.userSlug;
    const serviceRequestSlugQuery = result.data.serviceRequestSlug;

    return { props: { userSlugQuery, serviceRequestSlugQuery, session } };
  },
});

export default PublishPage;
