import { NotFound } from '@/layouts/not-found';
import { produce } from 'immer';
import {
  ArrowUpRight,
  Banknote,
  DoorOpen,
  FolderClock,
  LockIcon,
  MapPin,
  MoreHorizontal,
  PhoneCall,
  Share2Icon,
  ShieldClose,
  TimerIcon,
  Trash,
  User2Icon,
  UserCheck2,
  UserPlus2,
} from 'lucide-react';
import { Calendar } from 'lucide-react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { z } from 'zod';

import { BackButton } from '@/components/back-button/back-button';
import { CanView } from '@/components/can-view';
import { CommentForm } from '@/components/comment-form';
import { RenderHtml } from '@/components/render-html';
import { ShareButton } from '@/components/share-button';
import { AsyncWrapper } from '@/components/ui/async-wrapper';
import { AutoAnimate } from '@/components/ui/auto-animate';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/ui/empty-state';
import { GroupItem } from '@/components/ui/group-item';
import { IconContainer } from '@/components/ui/icon-container';
import { ImageGridGallery } from '@/components/ui/image';
import { Inline } from '@/components/ui/inline';
import { CenterContent } from '@/components/ui/layout';
import { openContextModal } from '@/components/ui/modal';
import { SectionMessage } from '@/components/ui/section-message';
import { Seo } from '@/components/ui/seo';
import { Separator } from '@/components/ui/separator';
import { FullSpinner } from '@/components/ui/spinner';
import { Tabs } from '@/components/ui/tabs';
import { toast } from '@/components/ui/toast';
import { Typography } from '@/components/ui/typography';
import { User } from '@/components/user';

import { useGetInfiniteComments } from '@/features/comments';
import {
  DEFAULT_SERVICE_REQUEST_COVER_IMAGE,
  ServiceRequestProviderReservationBtn,
} from '@/features/service-requests';
import { mapServiceRequestStatus } from '@/features/service-requests';

import { api } from '@/utils/api';
import { formatPhoneNumber } from '@/utils/misc';
import { formatPrice } from '@/utils/number';
import { isEmptyArray } from '@/utils/type-guards';

import {
  dateIsAfter,
  dateToReadableString,
  formatDateDistance,
} from '@/lib/date-fns';
import { buildImageUrl } from '@/lib/og-images';
import { cn } from '@/lib/utils';

import { createServerSideProps } from '@/server/utils/server-side';

type PageProps = Prettify<InferNextProps<typeof getServerSideProps>>;

enum ServiceRequestTab {
  COMMENTS = 'comments',
  RESERVED = 'reserved',
  PROPOSALS = 'proposals',
}

//TODO: Refactor the whole page by separing components on features folder.
const ServiceRequestPublicationPage = ({ profile, id }: PageProps) => {
  const queryUtils = api.useContext();
  const router = useRouter();

  const [tab, setTab] = useState<ServiceRequestTab>(ServiceRequestTab.COMMENTS);

  const { data, isInitialLoading, error, refetch } =
    api.serviceRequests.get.useQuery({
      id,
    });

  const deleteProposalMutation = api.serviceRequests.deleteProposal.useMutation(
    {
      onError(error) {
        toast({
          variant: 'danger',
          title: 'Une erreur est survenue',
          description: error?.message,
        });
      },
      async onSuccess(data) {
        await queryUtils.serviceRequests.get.invalidate({ id });
        await queryUtils.serviceRequests.getProposals.invalidate({
          id,
        });
      },
    }
  );

  const serviceRequest = data?.serviceRequest;

  const [isProposalOpen, setIsProposalOpen] = useState(false);

  const toggleViewProposal = () => setIsProposalOpen(!isProposalOpen);

  const { isLoading: isLoadingUpdate, mutate } =
    api.serviceRequests.update.useMutation({
      onMutate({ status }) {
        queryUtils.serviceRequests.get.setData(
          { id },
          produce(old => {
            if (!old) {
              return old;
            }
            old['serviceRequest']['status'] = status as never;
          })
        );
      },
      onError(error) {
        toast({
          variant: 'danger',
          title: 'Une erreur est survenue',
          description: error?.message,
        });
      },
      async onSuccess() {
        await queryUtils.serviceRequests.get.invalidate({ id });
        await queryUtils.serviceRequests.getStats.invalidate({ id });
        await queryUtils.serviceRequests.getProposals.invalidate({
          id,
        });
      },
    });

  const deleteServiceRequestMutation = api.serviceRequests.delete.useMutation({
    onError(error) {
      toast({
        variant: 'danger',
        title: 'Une erreur est survenue',
        description: error?.message,
      });
    },
    async onSuccess() {
      toast({
        variant: 'success',
        title: 'Votre demande à bien été supprimée',
        description: error?.message,
      });
      await router.push('/', undefined, { shallow: true });
    },
  });

  const {
    data: providersReservedData,
    isInitialLoading: isInitialLoadingProvidersReserved,
    error: ProvidersReservedError,
  } = api.serviceRequests.getReservedProviders.useQuery(
    { id },
    { enabled: !!serviceRequest && tab === ServiceRequestTab.RESERVED }
  );

  const {
    data: proposalsData,
    isInitialLoading: isInitialLoadingProposals,
    error: ProposalsError,
  } = api.serviceRequests.getProposals.useQuery(
    { id },
    { enabled: !!serviceRequest && tab === ServiceRequestTab.PROPOSALS }
  );

  const {
    comments,
    isInitialLoading: isInitialLoadingComments,
    error: commentsError,
  } = useGetInfiniteComments(
    {
      entityId: id,
      entityType: 'service-request',
    },
    { enabled: !!serviceRequest && tab === ServiceRequestTab.COMMENTS }
  );

  const { data: stats } = api.serviceRequests.getStats.useQuery({
    id,
  });

  const isServiceRequestOwner =
    profile?.id === serviceRequest?.author?.profile?.id;

  const ogInfo = {
    authorName: serviceRequest?.author?.profile?.name,
    authorAvatar: serviceRequest?.author?.profile?.avatar,
    title: serviceRequest?.title,
  };

  const isStatusOpen = serviceRequest?.status === 'OPEN';
  const isReserved = serviceRequest?.isProfileReserved;
  const hasSubmitProposal = serviceRequest?.hasProposalSubmitted;

  const serviceRequestAuthorId = serviceRequest?.author?.profile?.id;

  // const coverBg = isEmptyArray(serviceRequest?.photos)
  //   ? DEFAULT_SERVICE_REQUEST_COVER_IMAGE
  //   : serviceRequest?.photos?.[0]?.url;

  const images = serviceRequest?.photos?.map(el => ({
    name: el.name,
    url: el.url,
  }));

  if (isInitialLoading) return <FullSpinner isFullPage />;

  if (!serviceRequest) return <NotFound />;

  const meta = (
    <Seo
      title={`${ogInfo?.authorName} - ${ogInfo?.title}`}
      image={buildImageUrl('serviceRequest', ogInfo as never)}
      description={serviceRequest?.description}
    />
  );

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
            <BackButton href="/" label="Accueil" className="mb-3" />
            <ImageGridGallery
              className="h-64 w-full md:h-80"
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
                description="Cette demande de service est desormais cloturée. Vous ne pouvez plus interagir dessus."
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
                    variant={isStatusOpen ? 'success' : 'danger'}
                  />
                  {hasSubmitProposal && (
                    <Badge content="Proposition en attente" variant="primary" />
                  )}
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
                  {!isReserved && !hasSubmitProposal ? (
                    <Button
                      onClick={() => {
                        openContextModal({
                          modal: 'createProposal',
                          innerProps: {
                            serviceRequestName: serviceRequest?.title,
                            serviceRequestId: serviceRequest?.id,
                          },
                        });
                      }}
                      size="sm"
                      className="w-full sm:w-auto"
                    >
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
                    Envoyer un message
                  </Button>
                </CanView>
                <ShareButton
                  url={`/service-requests/${id}/${serviceRequest?.slug}`}
                  title={serviceRequest?.title}
                >
                  <Button variant="outline" size="sm">
                    <Share2Icon className="h-5 w-5" />
                    Partager
                  </Button>
                </ShareButton>
                {isServiceRequestOwner && (
                  <DropdownMenu>
                    <DropdownMenu.Trigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content className="min-w-[270px]">
                      <div className="flex flex-col space-y-1">
                        <>
                          {isStatusOpen && (
                            <DropdownMenu.Item
                              className={cn(
                                'default__transition flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2.5 text-sm text-gray-900 hover:bg-gray-100'
                              )}
                              onClick={() =>
                                mutate({
                                  serviceRequestId: id,
                                  status: 'CLOSED',
                                })
                              }
                              disabled={isLoadingUpdate}
                            >
                              <LockIcon className="h-5 w-5" />
                              Fermer ma demande
                            </DropdownMenu.Item>
                          )}
                          <DropdownMenu.Item
                            className={cn(
                              'default__transition flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2.5 text-sm text-red-600 hover:bg-red-100'
                            )}
                            onClick={() =>
                              deleteServiceRequestMutation.mutate({
                                id,
                              })
                            }
                            disabled={deleteServiceRequestMutation.isLoading}
                          >
                            <Trash className="h-5 w-5" />
                            Supprimer
                          </DropdownMenu.Item>
                        </>
                      </div>
                    </DropdownMenu.Content>
                  </DropdownMenu>
                )}
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
                {(isServiceRequestOwner || isReserved) && (
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
                className="flex-grow text-sm md:text-base"
              >
                Commentaires ({stats?.commentCount})
              </Tabs.Trigger>
              <Tabs.Trigger
                value={ServiceRequestTab.PROPOSALS}
                className="flex-grow text-sm md:text-base"
              >
                Propositions ({stats?.proposalCount})
              </Tabs.Trigger>
              <Tabs.Trigger
                value={ServiceRequestTab.RESERVED}
                className="flex-grow text-sm md:text-base"
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
                  disabled={!isStatusOpen}
                  // autoFocus
                />
                {comments?.length === 0 && (
                  <EmptyState
                    icon={<FolderClock />}
                    name="Aucun commentaire"
                    description="Ici vous trouverez la liste des commentaires faits par les prestataires intéressés par la demande."
                  />
                )}
                {comments && comments?.length > 0 && (
                  <AutoAnimate as="ul" role="list" className="space-y-3 py-2">
                    {comments?.map(comment => {
                      const isCommentOwner =
                        comment?.author?.id === serviceRequestAuthorId;

                      return (
                        <li
                          key={comment.id}
                          className="rounded-md border border-gray-100 bg-gray-50 p-3 sm:overflow-hidden sm:rounded-lg"
                        >
                          <div className="flex w-full items-start justify-between">
                            <User
                              badge={
                                isCommentOwner ? (
                                  <Badge
                                    content="Démandeur"
                                    size="xs"
                                    variant="outline"
                                    shape="rounded"
                                  />
                                ) : null
                              }
                              profile={comment?.author}
                              avatarProps={{ size: 'md' }}
                            />
                            {/* <ServiceRequestProviderReservationBtn
                              {...{
                                serviceRequestId: serviceRequest?.id,
                                providerProfileId: comment?.author?.id,
                              }}
                            /> */}
                          </div>
                          <div className="mt-2">
                            <RenderHtml
                              html={comment?.text}
                              truncate
                              lines={3}
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
                {proposalsData?.map(proposal => {
                  const isOwner = profile?.id === proposal?.author?.profile?.id;
                  const isUpdated = dateIsAfter(
                    proposal.updatedAt,
                    proposal.createdAt
                  );

                  return (
                    <div
                      key={proposal.id}
                      className="w-full rounded-md border border-gray-100 bg-gray-50 p-3"
                    >
                      <div className="flex w-full flex-nowrap items-start justify-between">
                        <div>
                          <Inline>
                            <User
                              profile={proposal?.author?.profile}
                              avatarProps={{ size: 'md' }}
                              size="lg"
                            />
                            {isUpdated && !proposal.isArchived && (
                              <span className="text-[10px] text-zinc-500">
                                (Modifié)
                              </span>
                            )}
                          </Inline>
                          <Badge
                            content={
                              proposal?.price
                                ? formatPrice(proposal.price)
                                : 'Pas de prix'
                            }
                          />
                          <RenderHtml
                            className="mt-2"
                            truncate
                            html={proposal?.content}
                          />
                        </div>
                        <ServiceRequestProviderReservationBtn
                          {...{
                            serviceRequestId: serviceRequest?.id,
                            providerProfileId: proposal?.author?.profile?.id,
                            proposalId: proposal.id,
                          }}
                        />
                        {isOwner && (
                          <Button
                            variant="outline"
                            title="Supprimer ma proposition"
                            size="sm"
                            isLoading={deleteProposalMutation.isLoading}
                            onClick={() =>
                              deleteProposalMutation.mutate({ id: proposal.id })
                            }
                          >
                            <Trash className="h-4 w-4" />
                            Supprimer
                          </Button>
                        )}
                      </div>
                      <div className="flex w-full items-center justify-between">
                        {proposal?.author?.profile?.providerInfo && (
                          <div className="mt-3 flex w-full flex-wrap items-center gap-2">
                            {proposal?.author?.profile?.providerInfo?.skills?.map(
                              skill => (
                                <Badge
                                  key={skill?.id}
                                  size="md"
                                  variant="outline"
                                  className="w-full max-w-md py-1.5 text-center"
                                  content={skill?.name}
                                />
                              )
                            )}
                          </div>
                        )}
                        <div className="ml-1 whitespace-nowrap text-xs text-gray-500">
                          {formatDateDistance(proposal?.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                  providersReservedData?.reservedProviders?.map(
                    reservedProvider => {
                      if (!reservedProvider) return null;

                      return (
                        <div
                          key={reservedProvider.profile?.id}
                          className="flex w-full flex-nowrap items-start justify-between gap-2 rounded-md bg-gray-50 p-3"
                        >
                          <div>
                            <User
                              profile={reservedProvider?.profile}
                              avatarProps={{ size: 'md' }}
                              size="lg"
                            />
                            {reservedProvider?.proposal ? (
                              <>
                                <Button
                                  size="xs"
                                  variant="link"
                                  className="mt-2"
                                  onClick={toggleViewProposal}
                                >
                                  <EyeIcon className="h-4 w-4" />
                                  {isProposalOpen
                                    ? 'Cacher la proposition'
                                    : 'Voir la proposition'}
                                </Button>
                                <AutoAnimate>
                                  {isProposalOpen && (
                                    <div className="mt-3 border-l border-gray-300 pl-6 opacity-75">
                                      <Badge
                                        className=""
                                        content={
                                          reservedProvider?.proposal?.price
                                            ? formatPrice(
                                                reservedProvider?.proposal
                                                  ?.price
                                              )
                                            : 'Pas de prix'
                                        }
                                      />
                                      <RenderHtml
                                        className="mt-3"
                                        truncate
                                        html={
                                          reservedProvider?.proposal?.content ||
                                          ''
                                        }
                                      />
                                    </div>
                                  )}
                                </AutoAnimate>
                              </>
                            ) : null}

                            {reservedProvider?.skills && (
                              <div className="mt-3 flex w-full flex-wrap items-center gap-2">
                                {reservedProvider?.skills?.map(skill => (
                                  <Badge
                                    key={skill?.id}
                                    size="md"
                                    variant="outline"
                                    className="w-full max-w-md py-1.5 text-center"
                                    content={skill?.name}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          <ServiceRequestProviderReservationBtn
                            {...{
                              serviceRequestId: serviceRequest?.id,
                              providerProfileId: reservedProvider.profile?.id,
                            }}
                          />
                        </div>
                      );
                    }
                  )}
              </div>
            </section>
          </AsyncWrapper>
        )}
      </CenterContent>
    </>
  );
};

const querySchema = z.object({
  id: z.string(),
  slug: z.array(z.string()).optional(),
});

export const getServerSideProps = createServerSideProps({
  shouldUseSession: true,
  shouldUseSSG: true,
  resolver: async ({ ctx, profile, ssg }) => {
    const result = querySchema.safeParse(ctx.query);

    if (!result.success) return { notFound: true };

    const { id } = result.data;

    if (ssg) {
      await ssg?.serviceRequests.get.prefetch({
        id,
      });
      await ssg?.serviceRequests.getStats.prefetch({
        id,
      });
    }

    return { props: { id, profile } };
  },
});

export default ServiceRequestPublicationPage;
