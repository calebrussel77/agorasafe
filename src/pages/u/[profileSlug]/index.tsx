import { NotFound } from '@/layouts/not-found';
import { ProfileType } from '@prisma/client';
import {
  ExternalLink,
  Facebook,
  MoreHorizontalIcon,
  Twitter,
} from 'lucide-react';
import { ShieldCheck } from 'lucide-react';
import { Linkedin } from 'lucide-react';
import { type InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useCopyToClipboard } from 'react-use';
import { z } from 'zod';

import { AsyncWrapper } from '@/components/ui/async-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { Image } from '@/components/ui/image';
import { Inline } from '@/components/ui/inline';
import { Seo } from '@/components/ui/seo';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/toast';
import { Typography } from '@/components/ui/typography';
import { UserAvatar } from '@/components/user-avatar';
import { UserBadge } from '@/components/user-badge';

import { useGetProfileDetails } from '@/features/profiles';

import { getIsFaceToFaceLabel, getIsRemoteLabel } from '@/utils/profile';
import { getAbsoluteHrefUrl } from '@/utils/routing';

import { formatDateDistance } from '@/lib/date-fns';
import { cn } from '@/lib/utils';

import { createServerSideProps } from '@/server/utils/server-side';

import { useCurrentUser } from '@/hooks/use-current-user';

const meta = {
  title: (str: string) => `${str} - Profil public`,
  description: (str: string) => str,
};

const ProjectShowCaseItem = ({
  imageUrl,
  title,
  description,
}: {
  imageUrl: string;
  title: string;
  description: string | null;
}) => {
  return (
    <div className="w-[280px] space-y-3">
      <span data-state="closed">
        <div className="relative overflow-hidden rounded-md">
          <Image
            alt={title}
            fill={false}
            width="280"
            height="300"
            className="h-auto w-auto object-cover transition-all hover:scale-105"
            src={imageUrl}
          />
        </div>
      </span>
      <div className="space-y-1 text-sm">
        <Typography as="h3" truncate lines={2} className="font-semibold">
          {title}
        </Typography>
        <Typography
          truncate
          lines={2}
          hasEllipsisText
          className="text-xs text-muted-foreground"
        >
          {description || '...'}
        </Typography>
      </div>
    </div>
  );
};
const ProfileDetailsPage = ({
  profileSlugQuery,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { profile } = useCurrentUser();
  const router = useRouter();
  const { data, isInitialLoading, error } = useGetProfileDetails({
    slug: profileSlugQuery,
  });
  const [state, copyToClipboard] = useCopyToClipboard();

  const profileName = data?.profile?.name || '';
  const isDeleted = !!data?.profile?.deletedAt;
  const isAdmin = data?.profile?.user?.role === 'ADMIN';
  const isCustomer = data?.profile?.type === 'CUSTOMER';
  const isMyProfile = data?.profile?.id === profile?.id;
  const pageLink = getAbsoluteHrefUrl(router.asPath);

  useEffect(() => {
    if (state.value)
      toast({
        variant: 'success',
        title: 'Lien du profil copié avec succès',
      });
  }, [state]);

  if (isDeleted) return <NotFound />;

  return (
    <>
      <Seo
        title={meta.title(profileName)}
        description={meta.description(data?.profile?.bio || '')}
        image={data?.profile?.avatar || undefined}
      />
      <AsyncWrapper isLoading={isInitialLoading} error={error}>
        <section>
          <div className="relative overflow-hidden">
            <Image
              className="h-32 w-full object-cover lg:h-44"
              src="/images/profile-background-01.jpg"
              alt="Profile Banner"
            />
          </div>
          <div className="relative mx-auto max-w-7xl px-4">
            <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
              <div className="flex">
                <UserAvatar
                  type={data?.profile?.type as ProfileType}
                  className="h-24 w-24 rounded-full bg-gray-200 object-cover !ring-4 ring-card sm:h-32 sm:w-32"
                  src={data?.profile?.avatar as string}
                  alt={profileName}
                />
              </div>
              <div
                className={cn(
                  'mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1',
                  isCustomer && 'sm:mt-10 lg:mt-6'
                )}
              >
                <div className="mt-6 min-w-0 flex-1">
                  <h1 className="flex items-center">
                    <Typography
                      as="span"
                      truncate
                      className="text-2xl font-bold"
                    >
                      {profileName}
                    </Typography>
                    <UserBadge
                      className="ml-2"
                      type={data?.profile?.type as ProfileType}
                    />
                    {isAdmin && (
                      <ShieldCheck className="ml-1 h-4 w-4 flex-shrink-0 text-green-500" />
                    )}
                  </h1>
                  <Inline className="flex flex-wrap text-sm font-normal text-muted-foreground">
                    <p>
                      Membre depuis{' '}
                      {formatDateDistance(data?.profile?.createdAt)}
                    </p>
                    {isCustomer && (
                      <p>{`${data?.profile?.customerJobPostedCount} Demande Postée(s)`}</p>
                    )}
                    {isCustomer && (
                      <p>{`${data?.profile?.customerJobProvidersReservedCount} Prestataires réservé(s)`}</p>
                    )}
                    {!isCustomer && (
                      <p>{`${data?.profile?.providerJobsReservedCount} Jobs réalisé(s)`}</p>
                    )}
                  </Inline>
                </div>
                <div className="mt-6 flex w-full flex-row items-center space-x-4 sm:w-auto sm:justify-stretch">
                  {isMyProfile && (
                    <Button
                      href="/dashboard/settings"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      Modifier
                    </Button>
                  )}
                  {!isMyProfile && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      Envoyer un message
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenu.Trigger asChild>
                      <Button variant="outline" size="sm" className="w-auto">
                        <MoreHorizontalIcon className="h-5 w-5" />
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <DropdownMenu.Item
                        onClick={() => copyToClipboard(pageLink)}
                      >
                        Copier le lien
                      </DropdownMenu.Item>
                      <DropdownMenu.Item asChild>
                        <a href={`https://wa.me/send?text=${pageLink}`}>
                          Partager sur whatsapp
                        </a>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="mx-auto mt-3 w-full max-w-7xl px-4 md:mt-10">
          <div
            className={cn(
              'space-y-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0',
              isCustomer && 'lg:grid-cols-2'
            )}
          >
            <div>
              <h3 className="text-skin-inverted font-sans text-lg font-medium leading-6">
                Biographie
              </h3>
              <Typography
                truncate
                lines={3}
                hasEllipsisText
                className="mt-2 font-normal text-muted-foreground"
              >
                {data?.profile?.bio || '...'}
              </Typography>
              <div className="mb-6 mt-4 flex items-center gap-x-4">
                {data?.profile?.facebookUrl && (
                  <a
                    href={data?.profile?.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-skin-inverted text-muted-foreground"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {data?.profile?.XUrl && (
                  <a
                    href={data?.profile?.XUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-skin-inverted text-muted-foreground"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {data?.profile?.linkedinUrl && (
                  <a
                    href={data?.profile?.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-[#004182]"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
            <div className={cn('lg:col-span-2', isCustomer && 'lg:col-span-1')}>
              <dl
                className={cn(
                  'grid grid-cols-1 gap-x-3 gap-y-6 sm:grid-cols-3',
                  isCustomer && 'sm:grid-cols-2'
                )}
              >
                <div className="sm:col-span-1">
                  <dt className="font-sans text-sm font-medium text-muted-foreground">
                    Localisation
                  </dt>
                  <dd className="text-skin-inverted-muted mt-1 font-normal">
                    {data?.profile?.location?.name || '...'}
                  </dd>
                </div>
                {!isCustomer && (
                  <div className="sm:col-span-1">
                    <dt className="font-sans text-sm font-medium text-muted-foreground">
                      Profession
                    </dt>
                    <dd className="text-skin-inverted-muted mt-1 font-normal">
                      {data?.profile?.providerInfo?.profession || '...'}
                    </dd>
                  </div>
                )}
                <div className="sm:col-span-1">
                  <dt className="font-sans text-sm font-medium text-muted-foreground">
                    Site internet
                  </dt>
                  <dd className="text-skin-inverted-muted mt-1 font-normal">
                    {data?.profile?.websiteUrl ? (
                      <a
                        href={data?.profile?.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-skin-primary hover:text-skin-primary-hover inline-flex items-center"
                      >
                        {data?.profile?.websiteUrl || '...'}
                        <ExternalLink className="ml-1.5 h-5 w-5" />
                      </a>
                    ) : (
                      '...'
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
        {!isCustomer &&
          data?.profile?.providerInfo?.showCaseProjects &&
          data?.profile?.providerInfo?.showCaseProjects?.length > 0 && (
            <section className="mx-auto mt-3 w-full max-w-7xl px-4 md:mt-10">
              <div className="mx-auto flex w-auto items-center justify-center gap-6">
                {data?.profile?.providerInfo?.showCaseProjects?.map(project => (
                  <ProjectShowCaseItem
                    key={project?.id}
                    imageUrl={project?.photo?.url}
                    description={project?.description}
                    title={project?.title}
                  />
                ))}
              </div>
            </section>
          )}

        <section className="mx-auto mt-3 w-full max-w-7xl px-4 md:mt-10">
          <div className="mt-6 space-y-1">
            <h2 className="text-xl font-semibold">A propos de moi</h2>
          </div>
          <Separator className="my-4 w-full " />
          <div className="text-gray-600">{data?.profile?.aboutMe ?? '...'}</div>
        </section>

        {!isCustomer && (
          <section className="mx-auto mt-3 w-full max-w-7xl px-4 md:mt-10">
            <div className="mt-6 space-y-1">
              <h2 className="text-xl font-semibold">Mes engagements clients</h2>
            </div>
            <Separator className="my-4 w-full " />
            <div className="flex w-full flex-wrap items-center gap-3">
              {data?.profile?.providerInfo?.skills?.map(skill => (
                <Badge
                  key={skill?.id}
                  size="lg"
                  variant="primary"
                  className="w-full max-w-md py-1.5"
                  content={skill?.name}
                />
              ))}

              {data?.profile?.providerInfo?.skills?.length === 0 && '...'}
            </div>
          </section>
        )}

        {!isCustomer && (
          <section className="mx-auto mt-3 w-full max-w-7xl px-4 md:mt-10">
            <div className="mt-6 space-y-1">
              <h2 className="text-xl font-semibold">Modes de travail</h2>
            </div>
            <Separator className="my-4 w-full " />
            <div className="flex w-full flex-wrap items-center gap-3">
              <Badge
                size="lg"
                variant="primary"
                className="py-1.5"
                content={getIsFaceToFaceLabel(
                  data?.profile?.providerInfo?.isFaceToFace
                )}
              />
              <Badge
                size="lg"
                variant="primary"
                className="py-1.5"
                content={getIsRemoteLabel(
                  data?.profile?.providerInfo?.isRemote
                )}
              />
            </div>
          </section>
        )}
      </AsyncWrapper>
    </>
  );
};

const querySchema = z.object({
  profileSlug: z.string(),
});

export const getServerSideProps = createServerSideProps({
  shouldUseSSG: true,
  resolver: async ({ ctx, ssg }) => {
    const result = querySchema.safeParse(ctx.query);

    if (!result.success) return { notFound: true };

    const profileSlugQuery = result.data.profileSlug;

    await ssg?.profiles.getProfileDetails.prefetch({
      slug: profileSlugQuery,
    });

    return { props: { profileSlugQuery } };
  },
});

export default ProfileDetailsPage;
