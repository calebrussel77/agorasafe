import { NotFound } from '@/layouts/not-found';
import {
  Banknote,
  FolderClock,
  MapPin,
  PhoneCall,
  Share2Icon,
  TimerIcon,
  User2Icon,
  UserMinus,
  UserPlus,
} from 'lucide-react';
import { Calendar } from 'lucide-react';
import { EyeOffIcon } from 'lucide-react';
import { MoveLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import { z } from 'zod';

import { ActionTooltip } from '@/components/action-tooltip';
import { CanView } from '@/components/can-view';
import { ShareButton } from '@/components/share-button/share-button';
import { AsyncWrapper } from '@/components/ui/async-wrapper';
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
import { toast } from '@/components/ui/toast';
import { Truncate } from '@/components/ui/truncate';
import { Typography } from '@/components/ui/typography';
import { User, UserAvatar, UserName } from '@/components/user';

import {
  DEFAULT_SERVICE_REQUEST_COVER_IMAGE,
  ServiceRequestCommentForm,
  useToggleServiceRequestReservation,
} from '@/features/service-requests';
import {
  mapServiceRequestStatusToString,
  useGetServiceRequest,
  useServiceRequestComments,
  useUpdateServiceRequest,
} from '@/features/services';

import { api } from '@/utils/api';
import { formatPhoneNumber } from '@/utils/misc';
import { isEmptyArray } from '@/utils/type-guards';

import {
  dateToReadableString,
  formatDateDistance,
  formatDateRelative,
} from '@/lib/date-fns';
import { htmlParse } from '@/lib/html-react-parser';

import { createServerSideProps } from '@/server/utils/server-side';

type PageProps = Prettify<InferNextProps<typeof getServerSideProps>>;

const ServiceRequestPublicationPage = ({
  profile,
  serviceRequestSlugQuery,
}: PageProps) => {
  const router = useRouter();
  const queryUtils = api.useContext();

  const {
    mutate: mutateToggleReservation,
    isLoading: isLoadingToggleReservation,
  } = useToggleServiceRequestReservation({
    onError(error) {
      toast({
        variant: 'danger',
        title: 'Une erreur est survenue',
        description: error?.message,
      });
    },
    async onSuccess(data, variables, context) {
      await queryUtils.services.getServiceRequest.invalidate({
        slug: serviceRequestSlugQuery,
        providersReserved: 'Active',
      });
      toast({
        delay: 2000,
        variant: 'success',
        title: data?.message,
      });
    },
  });

  const { data, isInitialLoading, error } = useGetServiceRequest({
    slug: serviceRequestSlugQuery,
    providersReserved: 'Active',
  });

  const { isLoading: isLoadingUpdate, mutate } = useUpdateServiceRequest({
    onError(error) {
      toast({
        variant: 'danger',
        title: 'Une erreur est survenue',
        description: error?.message,
      });
    },
  });

  const {
    data: commentsData,
    isInitialLoading: isInitialLoadingComments,
    error: commentsError,
  } = useServiceRequestComments({
    serviceRequestSlug: serviceRequestSlugQuery,
  });

  const isAuthorMine =
    profile?.id === data?.serviceRequest?.author?.profile?.id;
  const authorName = data?.serviceRequest?.author?.profile?.name;
  const commentsCount = commentsData?.serviceRequestComments?.length;
  const providersReservedCount =
    data?.serviceRequest?._count?.providersReserved || 0;
  const providersReserved = data?.serviceRequest?.providersReserved || [];

  const isStatusOpen = data?.serviceRequest?.status === 'OPEN';
  const isReserved = providersReserved?.some(
    providerReserved => providerReserved?.providerProfileId === profile?.id
  );
  const serviceRequestAuthorId = data?.serviceRequest?.author?.profile?.id;
  const hasComments = !isEmptyArray(commentsData?.serviceRequestComments);
  const coverBg = isEmptyArray(data?.serviceRequest?.photos)
    ? DEFAULT_SERVICE_REQUEST_COVER_IMAGE
    : data?.serviceRequest?.photos?.[0]?.url;

  const images = data?.serviceRequest?.photos?.map(el => ({
    name: el.name,
    url: el.url,
  }));

  const meta = (
    <Seo
      title={`${authorName} - ${data?.serviceRequest?.title}`}
      image={coverBg}
      description={data?.serviceRequest?.description}
    />
  );

  if (isInitialLoading || isInitialLoadingComments) return <FullSpinner />;

  if (!data?.serviceRequest) return <NotFound />;

  return (
    <>
      {meta}
      <CenterContent className="mt-6 space-y-10">
        <AsyncWrapper isLoading={isInitialLoading} error={error}>
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
                title="Réservation de la demande"
                description="Vous faites partie des prestataires réservés pour cette demande."
              />
            )}

            {!isStatusOpen && (
              <SectionMessage
                appareance="danger"
                className="my-2"
                title="Demande clôturée"
                description="Cette demande de service est desormais cloturée."
              />
            )}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <Typography variant="small">
                    Publiée le{' '}
                    {data?.serviceRequest?.createdAt &&
                      dateToReadableString(data?.serviceRequest?.createdAt)}
                  </Typography>
                  <Badge
                    content={mapServiceRequestStatusToString(
                      data?.serviceRequest?.status
                    )}
                    variant={isStatusOpen ? 'primary' : 'danger'}
                  />
                </div>
                <Typography as="h2" className="mt-1">
                  {data?.serviceRequest?.title}
                </Typography>
                <Inline>
                  <GroupItem
                    isHoverDisabled
                    classNames={{
                      name: 'text-sm text-muted-foreground font-normal whitespace-nowrap truncate',
                    }}
                    iconBefore={<MapPin className="h-5 w-5" />}
                    name={data?.serviceRequest?.location?.name}
                  />
                  <GroupItem
                    isHoverDisabled
                    classNames={{
                      name: 'text-sm text-muted-foreground font-normal whitespace-nowrap truncate',
                    }}
                    iconBefore={<User2Icon className="h-5 w-5" />}
                    name={data?.serviceRequest?.nbProviderNeededFormattedText}
                  />
                </Inline>
              </div>
              <div className="ml-2 flex w-full items-center gap-2 sm:w-auto sm:flex-row">
                <CanView allowedProfiles={['PROVIDER']}>
                  <Button
                    size="sm"
                    href={`/dashboard/inbox?profileId=${data?.serviceRequest?.author?.profile?.id}`}
                    className="w-full sm:w-auto"
                  >
                    Envoyer un message
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
                      ? 'Annuler ma demande'
                      : 'Republier ma demande'}
                  </Button>
                )}
                <ShareButton
                  url={`/service-requests/${serviceRequestSlugQuery}`}
                  title={data?.serviceRequest?.title}
                >
                  <Button variant="outline" size="sm">
                    <Share2Icon className="h-5 w-5" />
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
                    {data?.serviceRequest?.estimatedPriceFormatted}
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
                    {data?.serviceRequest?.datePeriodFormattedText}
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
                    {data?.serviceRequest?.nbHoursFomattedText}
                  </Typography>
                }
              />
            </div>
            <Truncate hasEllipsisText lines={3} className="mt-3">
              {data?.serviceRequest?.description}
            </Truncate>
            <div className="mt-6">
              <Typography variant="subtle">A propos du demandeur</Typography>
              <div className="mt-3 flex w-full max-w-xl flex-wrap items-center justify-between gap-y-3">
                <User profile={data?.serviceRequest?.author?.profile} />
                {(isAuthorMine || isReserved) && (
                  <GroupItem
                    isHoverDisabled
                    iconBefore={
                      <PhoneCall className="h-5 w-5 text-brand-500" />
                    }
                    name={
                      <Typography className="font-semibold">
                        {formatPhoneNumber(
                          data?.serviceRequest?.author?.profile?.phone || ''
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

          {/* Reserved providers section */}
          {providersReservedCount > 0 && (
            <section aria-labelledby="comment-section" className="w-full">
              <Typography as="h3">
                Prestataires réservés ({providersReservedCount})
              </Typography>
              <Separator className="my-4 w-full " />
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {providersReserved.map(element => {
                  const profile = element?.provider?.profile;
                  if (!profile) return null;

                  return (
                    <div
                      key={element.providerProfileId}
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
                                serviceRequestId: data?.serviceRequest?.id,
                                providerProfileId: profile?.id,
                              })
                            }
                            className="absolute right-2 top-2 rounded-full p-1 text-gray-600 hover:bg-gray-200"
                          >
                            <UserMinus className="h-5 w-5" />
                          </button>
                        </ActionTooltip>
                      )}
                      <UserAvatar
                        profile={profile}
                        className="aspect-square h-20 w-20 shadow-md sm:h-24 sm:w-24"
                      />
                      <div className="mt-3 flex items-start gap-1.5">
                        <UserName profile={profile} className="text-base" />
                      </div>
                      <Typography truncate variant="small" className="mt-1">
                        {profile.location?.name}
                      </Typography>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </AsyncWrapper>

        {/* Comments section */}
        <AsyncWrapper
          isLoading={isInitialLoadingComments}
          error={commentsError}
        >
          <section aria-labelledby="comment-section" className="w-full">
            <Typography as="h3">Commentaires ({commentsCount})</Typography>
            <Separator className="my-4 w-full " />
            <div className="mt-6">
              <div className="mx-auto w-full max-w-2xl space-y-6 py-6">
                <ServiceRequestCommentForm
                  serviceRequestSlug={serviceRequestSlugQuery}
                />
                {!hasComments && (
                  <EmptyState
                    icon={<FolderClock />}
                    name="Aucun commentaire"
                    description="Ici vous trouverez la liste des commentaires faits par les prestataires intéressés par la demande."
                  />
                )}
                {commentsData?.serviceRequestComments &&
                  commentsData?.serviceRequestComments?.length > 0 && (
                    <ul role="list" className="space-y-3 py-2">
                      {commentsData?.serviceRequestComments.map(comment => {
                        const isAuthor =
                          comment?.author?.id === serviceRequestAuthorId;
                        const canViewReservedBtn =
                          isAuthorMine &&
                          !isAuthor &&
                          isStatusOpen &&
                          comment?.author?.type === 'PROVIDER';
                        const isReserved = providersReserved?.some(
                          el => el.providerProfileId === comment?.author?.id
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
                                    variant={
                                      isReserved ? 'outline' : 'secondary'
                                    }
                                    disabled={isLoadingToggleReservation}
                                    onClick={() =>
                                      mutateToggleReservation({
                                        customerProfileId:
                                          serviceRequestAuthorId as string,
                                        serviceRequestId:
                                          data?.serviceRequest?.id,
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
                              <div className="text-sm text-gray-600">
                                {htmlParse(comment?.text)}
                              </div>
                              <div className="mt-2 flex w-full items-end justify-end space-x-2 text-sm">
                                <span className="text-xs text-gray-500">
                                  {formatDateDistance(comment?.createdAt)}
                                </span>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
              </div>
            </div>
          </section>
        </AsyncWrapper>
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
      await ssg?.services.getServiceRequest.prefetch({
        slug: serviceRequestSlugQuery,
        providersReserved: 'Active',
      });

      await ssg?.services.getServiceRequestComments.prefetch({
        serviceRequestSlug: serviceRequestSlugQuery,
      });
    }

    return { props: { serviceRequestSlugQuery, profile } };
  },
});

export default ServiceRequestPublicationPage;
