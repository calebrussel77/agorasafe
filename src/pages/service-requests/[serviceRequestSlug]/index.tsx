import { NotFound } from '@/layouts/not-found';
import {
  Banknote,
  FolderClock,
  MapPin,
  PhoneCall,
  Share2Icon,
  TimerIcon,
  User2Icon,
  UserCheck2,
  UserMinus,
  UserPlus,
  UserPlus2,
} from 'lucide-react';
import { Calendar } from 'lucide-react';
import { EyeOffIcon } from 'lucide-react';
import { MoveLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { z } from 'zod';

import { ActionTooltip } from '@/components/action-tooltip';
import { CanView } from '@/components/can-view';
import { CommentForm } from '@/components/comment-form';
import { RenderHtml } from '@/components/render-html';
import { ShareButton } from '@/components/share-button/share-button';
import { AsyncWrapper } from '@/components/ui/async-wrapper';
import { AutoAnimate } from '@/components/ui/auto-animate';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { GroupItem } from '@/components/ui/group-item';
import { IconContainer } from '@/components/ui/icon-container';
import { ImageGridGallery } from '@/components/ui/image';
import { Inline } from '@/components/ui/inline';
import { CenterContent } from '@/components/ui/layout';
import { SectionMessage } from '@/components/ui/section-message';
import { Seo } from '@/components/ui/seo';
import { Separator } from '@/components/ui/separator';
import { FullSpinner } from '@/components/ui/spinner';
import { Tabs } from '@/components/ui/tabs';
import { toast } from '@/components/ui/toast';
import { Typography } from '@/components/ui/typography';
import { User, UserAvatar, UserName, UserRating } from '@/components/user';

import { useGetInfiniteComments } from '@/features/comments';
import { DEFAULT_SERVICE_REQUEST_COVER_IMAGE } from '@/features/service-requests';
import { mapServiceRequestStatus } from '@/features/service-requests';

import { api } from '@/utils/api';
import { formatPhoneNumber } from '@/utils/misc';
import { isEmptyArray } from '@/utils/type-guards';

import { dateToReadableString, formatDateDistance } from '@/lib/date-fns';

import { createServerSideProps } from '@/server/utils/server-side';

type PageProps = Prettify<InferNextProps<typeof getServerSideProps>>;

enum ServiceRequestTab {
  COMMENTS = 'comments',
  RESERVED = 'reserved',
  PROPOSALS = 'proposals',
}

const ServiceRequestPublicationPage = ({
  profile,
  serviceRequestSlugQuery,
}: PageProps) => {
  const router = useRouter();
  const queryUtils = api.useContext();

  const [tab, setTab] = useState<ServiceRequestTab>(ServiceRequestTab.COMMENTS);

  const { data, isInitialLoading, error, refetch } =
    api.serviceRequests.get.useQuery({
      slug: serviceRequestSlugQuery,
      providersReserved: 'Active',
    });

  const serviceRequest = data?.serviceRequest;

  const {
    mutate: mutateToggleReservation,
    isLoading: isLoadingToggleReservation,
  } = api.serviceRequests.toggleReservation.useMutation({
    onError(error) {
      toast({
        variant: 'danger',
        title: 'Une erreur est survenue',
        description: error?.message,
      });
    },
    async onSuccess(data) {
      await queryUtils.serviceRequests.get.invalidate({
        slug: serviceRequestSlugQuery,
        providersReserved: 'Active',
      });
      toast({
        delay: 2000,
        variant: 'success',
        title: data.message,
      });
    },
  });

  const { isLoading: isLoadingUpdate, mutate } =
    api.serviceRequests.update.useMutation({
      onError(error) {
        toast({
          variant: 'danger',
          title: 'Une erreur est survenue',
          description: error?.message,
        });
      },
    });

  const {
    data: providersReservedData,
    isInitialLoading: isInitialLoadingProvidersReserved,
    error: ProvidersReservedError,
  } = api.serviceRequests.getReservedProviders.useQuery(
    { id: serviceRequest?.id },
    { enabled: !!serviceRequest && tab === ServiceRequestTab.RESERVED }
  );

  const {
    data: proposalsData,
    isInitialLoading: isInitialLoadingProposals,
    error: ProposalsError,
  } = api.serviceRequests.getProposals.useQuery(
    { id: serviceRequest?.id },
    { enabled: !!serviceRequest && tab === ServiceRequestTab.PROPOSALS }
  );

  const {
    comments,
    isInitialLoading: isInitialLoadingComments,
    error: commentsError,
  } = useGetInfiniteComments(
    {
      entityId: serviceRequest?.id || '',
      entityType: 'service-request',
    },
    { enabled: !!serviceRequest && tab === ServiceRequestTab.COMMENTS }
  );

  const isAuthorMine = profile?.id === serviceRequest?.author?.profile?.id;
  const authorName = serviceRequest?.author?.profile?.name;

  const isStatusOpen = serviceRequest?.status === 'OPEN';
  const isReserved = serviceRequest?.isProfileReserved;

  const serviceRequestAuthorId = serviceRequest?.author?.profile?.id;
  const coverBg = isEmptyArray(serviceRequest?.photos)
    ? DEFAULT_SERVICE_REQUEST_COVER_IMAGE
    : serviceRequest?.photos?.[0]?.url;

  const stats = serviceRequest?.stats;

  const images = serviceRequest?.photos?.map(el => ({
    name: el.name,
    url: el.url,
  }));

  const meta = (
    <Seo
      title={`${authorName} - ${serviceRequest?.title}`}
      image={coverBg}
      description={serviceRequest?.description}
    />
  );

  if (isInitialLoading) return <FullSpinner isFullPage />;

  if (!serviceRequest) return <NotFound />;

  return (
    <>
      {meta}
      <CenterContent className="mt-6 max-w-5xl space-y-10">
        <AsyncWrapper
          isLoading={isInitialLoading}
          error={error}
          onRetryError={refetch}
        >
          <section
            aria-labelledby="service-request-main-infos"
            className="w-full"
          >
            <button
              onClick={() => void router.push('/')}
              className="mb-3 flex items-center gap-2"
            >
              <MoveLeft className="h-5 w-5" />
              <span>Accueil</span>
            </button>
            <ImageGridGallery
              className="h-64 w-full bg-gray-100 md:h-80"
              images={
                isEmptyArray(images)
                  ? [
                      {
                        name: 'Image artistique de fond',
                        url: DEFAULT_SERVICE_REQUEST_COVER_IMAGE,
                      },
                    ]
                  : (images as never)
              }
            />

            {isReserved && isStatusOpen && (
              <SectionMessage
                appareance="success"
                className="my-2"
                title="Prestataires réservés"
                description="Vous faites partie des prestataires réservés pour cette demande."
                hasCloseButton={false}
              />
            )}

            {!isStatusOpen && (
              <SectionMessage
                appareance="danger"
                className="my-2"
                title="Demande clôturée"
                hasCloseButton={false}
                description="Cette demande de service est desormais cloturée."
              />
            )}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <Typography variant="small">
                    Publiée le{' '}
                    {serviceRequest?.createdAt &&
                      dateToReadableString(serviceRequest?.createdAt)}
                  </Typography>
                  <Badge
                    content={
                      mapServiceRequestStatus[serviceRequest?.status as never]
                    }
                    variant={isStatusOpen ? 'primary' : 'danger'}
                  />
                </div>
                <Typography as="h2" className="mt-1">
                  {serviceRequest?.title}
                </Typography>
                <Inline>
                  <GroupItem
                    isHoverDisabled
                    classNames={{
                      name: 'text-sm text-muted-foreground font-normal whitespace-nowrap truncate',
                    }}
                    iconBefore={<MapPin className="h-5 w-5" />}
                    name={serviceRequest?.location?.address}
                  />
                  <GroupItem
                    isHoverDisabled
                    classNames={{
                      name: 'text-sm text-muted-foreground font-normal whitespace-nowrap truncate',
                    }}
                    iconBefore={<User2Icon className="h-5 w-5" />}
                    name={serviceRequest?.nbProviderNeededFormattedText}
                  />
                </Inline>
              </div>
              <div className="ml-2 flex w-full items-center gap-2 sm:w-auto sm:flex-row">
                <CanView allowedProfiles={['PROVIDER']}>
                  {!isReserved ? (
                    <Button size="sm" className="w-full sm:w-auto">
                      Faire une proposition
                    </Button>
                  ) : null}
                </CanView>
                <CanView allowedProfiles={['PROVIDER']}>
                  <Button
                    size="sm"
                    variant="outline"
                    href={`/dashboard/inbox?profileId=${serviceRequest?.author?.profile?.id}`}
                    className="w-full sm:w-auto"
                  >
                    Envoyer un Message
                  </Button>
                </CanView>
                {isAuthorMine && (
                  <Button
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() =>
                      mutate({
                        serviceRequestSlug: serviceRequestSlugQuery,
                        status: isStatusOpen ? 'CLOSED' : 'OPEN',
                      })
                    }
                    isLoading={isLoadingUpdate}
                    variant={isStatusOpen ? 'outline' : 'default'}
                  >
                    {isStatusOpen
                      ? 'Clôturer ma demande'
                      : 'Republier ma demande'}
                  </Button>
                )}
                <ShareButton
                  url={`/service-requests/${serviceRequestSlugQuery}`}
                  title={serviceRequest?.title}
                >
                  <Button variant="outline" size="sm">
                    <Share2Icon className="h-5 w-5" />
                    {!profile && 'Partager'}
                  </Button>
                </ShareButton>
              </div>
            </div>
            <div className="mt-3">
              <GroupItem
                isHoverDisabled
                iconBefore={
                  <IconContainer>
                    <Banknote className="h-4 w-4" />
                  </IconContainer>
                }
                name={
                  <Typography className="font-semibold">
                    {serviceRequest?.estimatedPriceFormatted}
                  </Typography>
                }
              />
              <GroupItem
                isHoverDisabled
                iconBefore={
                  <IconContainer>
                    <Calendar className="h-4 w-4" />
                  </IconContainer>
                }
                name={
                  <Typography className="font-semibold">
                    {serviceRequest?.datePeriodFormattedText}
                  </Typography>
                }
              />
              <GroupItem
                isHoverDisabled
                iconBefore={
                  <IconContainer>
                    <TimerIcon className="h-4 w-4" />
                  </IconContainer>
                }
                name={
                  <Typography className="whitespace-nowrap font-semibold">
                    {serviceRequest?.nbHoursFomattedText}
                  </Typography>
                }
              />
            </div>

            {/* Content section */}
            <RenderHtml
              html={serviceRequest?.description as string}
              truncate
              lines={3}
              className="mt-3"
            />
            <div className="mt-6">
              <Typography variant="subtle">A propos du demandeur</Typography>
              <div className="mt-3 flex w-full max-w-xl flex-wrap items-center justify-between gap-y-3">
                <User profile={serviceRequest?.author?.profile} />
                {(isAuthorMine || isReserved) && (
                  <GroupItem
                    isHoverDisabled
                    iconBefore={
                      <PhoneCall className="h-5 w-5 text-brand-500" />
                    }
                    name={
                      <Typography className="font-semibold">
                        {formatPhoneNumber(
                          serviceRequest?.author?.profile?.phone || ''
                        )}
                      </Typography>
                    }
                    description={
                      !isReserved && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <EyeOffIcon className="h-4 w-4" />
                          Masqué jusqu'à la réservation
                        </div>
                      )
                    }
                  />
                )}
              </div>
            </div>
          </section>

          <Tabs
            defaultValue={ServiceRequestTab.COMMENTS}
            className="mt-3 w-full"
            onValueChange={setTab as never}
          >
            <Tabs.List className="w-full">
              <Tabs.Trigger
                value={ServiceRequestTab.COMMENTS}
                className="flex-grow text-base"
              >
                Commentaires ({stats?.commentCount})
              </Tabs.Trigger>
              <Tabs.Trigger
                value={ServiceRequestTab.PROPOSALS}
                className="flex-grow text-base"
              >
                Propositions ({stats?.proposalCount})
              </Tabs.Trigger>
              <Tabs.Trigger
                value={ServiceRequestTab.RESERVED}
                className="flex-grow text-base"
              >
                Reservés ({stats?.providersReservedCount})
              </Tabs.Trigger>
            </Tabs.List>
          </Tabs>
        </AsyncWrapper>

        {/* TODO: Need to finish lazy loading for comments */}
        {/* Comments section */}
        {tab === ServiceRequestTab.COMMENTS && (
          <AsyncWrapper
            isLoading={isInitialLoadingComments}
            error={commentsError}
          >
            <section aria-labelledby="comment-section" className="w-full">
              <Typography as="h3">
                Commentaires ({stats?.commentCount})
              </Typography>
              <Separator className="my-4 w-full " />
              <div className="mt-6 space-y-6 py-6">
                <CommentForm
                  entityId={serviceRequest?.id}
                  entityType="service-request"
                  // autoFocus
                />
                {stats?.commentCount === 0 && (
                  <EmptyState
                    icon={<FolderClock />}
                    name="Aucun commentaire"
                    description="Ici vous trouverez la liste des commentaires faits par les prestataires intéressés par la demande."
                  />
                )}
                {comments && comments?.length > 0 && (
                  <AutoAnimate as="ul" role="list" className="space-y-3 py-2">
                    {comments?.map(comment => {
                      const isAuthor =
                        comment?.author?.id === serviceRequestAuthorId;
                      const canViewReservedBtn =
                        isAuthorMine &&
                        !isAuthor &&
                        isStatusOpen &&
                        comment?.author?.type === 'PROVIDER';

                      const isReserved = providersReservedData?.some(
                        el => el.id === comment?.author?.id
                      );

                      const btnMessage = isReserved
                        ? 'Annuler la réservation'
                        : 'Réserver';

                      return (
                        <li
                          key={comment.id}
                          className="border border-gray-300 bg-white p-3 shadow-sm sm:overflow-hidden sm:rounded-lg"
                        >
                          <div className="flex w-full items-start justify-between">
                            <User
                              badge={
                                isAuthor ? (
                                  <Badge
                                    content="Auteur"
                                    size="xs"
                                    variant="outline"
                                    // className="-mt-2"
                                    shape="rounded"
                                  />
                                ) : null
                              }
                              profile={comment?.author}
                              avatarProps={{ size: 'md' }}
                            />
                            {canViewReservedBtn && (
                              <ActionTooltip label={btnMessage}>
                                <Button
                                  variant={isReserved ? 'outline' : 'secondary'}
                                  disabled={isLoadingToggleReservation}
                                  onClick={() =>
                                    mutateToggleReservation({
                                      customerProfileId:
                                        serviceRequestAuthorId as string,
                                      serviceRequestId: serviceRequest?.id,
                                      providerProfileId: comment?.author?.id,
                                    })
                                  }
                                  className="ml-1"
                                >
                                  {!isReserved ? (
                                    <UserPlus className="h-4 w-4" />
                                  ) : (
                                    <UserMinus className="h-4 w-4" />
                                  )}
                                </Button>
                              </ActionTooltip>
                            )}
                          </div>
                          <div className="mt-2">
                            <RenderHtml
                              html={comment?.text}
                              truncate
                              lines={3}
                              className="text-sm text-gray-600"
                            />

                            <div className="mt-2 flex w-full items-end justify-end space-x-2 text-sm">
                              <span className="text-xs text-gray-500">
                                {formatDateDistance(comment?.createdAt)}
                              </span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </AutoAnimate>
                )}
              </div>
            </section>
          </AsyncWrapper>
        )}

        {/* Reserved providers section */}
        {tab === ServiceRequestTab.RESERVED && (
          <AsyncWrapper
            isLoading={isInitialLoadingProvidersReserved}
            error={ProvidersReservedError}
          >
            <section aria-labelledby="providers-reserved" className="w-full">
              <Typography as="h3">
                Prestataires réservés ({stats?.providersReservedCount})
              </Typography>
              <Separator className="my-4 w-full " />
              {stats?.providersReservedCount === 0 && (
                <EmptyState
                  icon={<UserCheck2 />}
                  name="Aucun prestataires réservés"
                  description="Ici vous trouverez la liste des prestataires réservés."
                />
              )}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {providersReservedData &&
                  providersReservedData?.map(providerProfile => {
                    if (!providerProfile) return null;
                    return (
                      <div
                        key={providerProfile.id}
                        className="group relative flex w-full max-w-[250px] flex-col items-center justify-center rounded-md border bg-gray-100 p-3"
                      >
                        {isStatusOpen && isAuthorMine && (
                          <ActionTooltip label="Annuler la réservation">
                            <button
                              disabled={isLoadingToggleReservation}
                              onClick={() =>
                                mutateToggleReservation({
                                  customerProfileId:
                                    serviceRequestAuthorId as string,
                                  serviceRequestId: serviceRequest?.id,
                                  providerProfileId: providerProfile?.id,
                                })
                              }
                              className="absolute right-2 top-2 rounded-full p-1 text-gray-600 hover:bg-gray-200"
                            >
                              <UserMinus className="h-5 w-5" />
                            </button>
                          </ActionTooltip>
                        )}
                        <UserAvatar
                          profile={providerProfile}
                          className="aspect-square h-20 w-20 shadow-md sm:h-24 sm:w-24"
                        />
                        <UserName
                          profile={providerProfile}
                          canLinkToProfile
                          className="mt-3 text-base"
                        />
                        <Typography truncate variant="small">
                          {providerProfile.location?.address}
                        </Typography>
                        <UserRating
                          className="mt-1"
                          reviewsCount={
                            providerProfile?._count?.receivedReviews
                          }
                        />
                      </div>
                    );
                  })}
              </div>
            </section>
          </AsyncWrapper>
        )}

        {/* Propositions section */}
        {tab === ServiceRequestTab.PROPOSALS && (
          <AsyncWrapper
            isLoading={isInitialLoadingProposals}
            error={ProposalsError}
          >
            <section aria-labelledby="providers-reserved" className="w-full">
              <Typography as="h3">
                Propositions ({stats?.proposalCount})
              </Typography>
              <Separator className="my-4 w-full " />
              {stats?.proposalCount === 0 && (
                <EmptyState
                  icon={<UserPlus2 />}
                  name="Aucune proposition pour l'instant"
                  description="Ici vous trouverez la liste des propositions faites pour la demande."
                />
              )}
              <div className="mt-6 flex w-full flex-wrap items-center gap-3">
                {proposalsData?.map(proposalProfile => (
                  <div
                    key={proposalProfile.id}
                    className="flex w-full flex-nowrap items-center justify-between gap-2 rounded-md bg-gray-50 p-3"
                  >
                    <User
                      profile={proposalProfile}
                      avatarProps={{ size: 'md' }}
                      size="md"
                    />
                    <Button size="sm" variant="outline">
                      Réserver
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          </AsyncWrapper>
        )}
      </CenterContent>
    </>
  );
};

const querySchema = z.object({
  serviceRequestSlug: z.string().trim(),
});

export const getServerSideProps = createServerSideProps({
  shouldUseSession: true,
  shouldUseSSG: true,
  resolver: async ({ ctx, profile, ssg }) => {
    const result = querySchema.safeParse(ctx.query);

    if (!result.success) return { notFound: true };

    const { serviceRequestSlug: serviceRequestSlugQuery } = result.data;

    //Prefetch queries so it is already on the client side cache
    if (ssg) {
      await ssg?.serviceRequests.get.prefetch({
        slug: serviceRequestSlugQuery,
        providersReserved: 'Active',
      });
    }

    return { props: { serviceRequestSlugQuery, profile } };
  },
});

export default ServiceRequestPublicationPage;
