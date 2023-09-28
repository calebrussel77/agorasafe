import {
  Banknote,
  FolderClock,
  MapPin,
  MoreVertical,
  PhoneCall,
  TimerIcon,
  User2Icon,
} from 'lucide-react';
import { Calendar } from 'lucide-react';
import { EyeOffIcon } from 'lucide-react';
import { MoveLeft } from 'lucide-react';
import { type InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useCopyToClipboard } from 'react-use';
import { z } from 'zod';

import { CanView } from '@/components/can-view';
import { AsyncWrapper } from '@/components/ui/async-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/ui/empty-state';
import { GroupItem } from '@/components/ui/group-item';
import { IconContainer } from '@/components/ui/icon-container';
import { Image, ImageGridGallery } from '@/components/ui/image';
import { Inline } from '@/components/ui/inline';
import { CenterContent } from '@/components/ui/layout';
import { Seo } from '@/components/ui/seo';
import { toast } from '@/components/ui/toast';
import { Truncate } from '@/components/ui/truncate';
import { Typography } from '@/components/ui/typography';
import { User } from '@/components/user';

import { LoginRedirect } from '@/features/auth';
import { MakeOfferModal } from '@/features/service-requests';
import {
  mapServiceRequestStatusToString,
  useGetServiceRequest,
  useServiceRequestOffers,
  useUpdateServiceRequest,
} from '@/features/services';

import { formatPhoneNumber } from '@/utils/misc';
import { getAbsoluteHrefUrl } from '@/utils/routing';
import { isEmptyArray } from '@/utils/type-guards';

import { dateToReadableString } from '@/lib/date-fns';
import { htmlParse } from '@/lib/html-react-parser';

import { createServerSideProps } from '@/server/utils/server-side';

const meta = {
  title: (serviceRequestTitle: string) => `${serviceRequestTitle}`,
  description: (serviceRequestDeescription: string) =>
    `${serviceRequestDeescription}`,
};
const ServiceRequestPublicationPage = ({
  profile,
  serviceRequestSlugQuery,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const [state, copyToClipboard] = useCopyToClipboard();

  const { data, isInitialLoading, error } = useGetServiceRequest({
    slug: serviceRequestSlugQuery,
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
    data: offersData,
    isInitialLoading: isInitialLoadingOffers,
    error: offersError,
  } = useServiceRequestOffers({
    serviceRequestSlug: serviceRequestSlugQuery,
  });
  const defaultCoverBgUrl = '/images/artistique-cover-photo.jpg';
  const isAuthorMine =
    profile?.id === data?.serviceRequest?.author?.profile?.id;
  const authorName = data?.serviceRequest?.author?.profile?.name;
  const offersCount = offersData?.serviceRequestOffers?.length;
  const isProvider = profile?.type === 'PROVIDER';
  const isStatusOpen = data?.serviceRequest?.status === 'OPEN';
  const pageLink = getAbsoluteHrefUrl(router.asPath);
  const isSelected = data?.serviceRequest?.choosedProviders?.some(
    choosedProvider => choosedProvider.provider.profile.id === profile?.id
  );

  const hasOffers = !isEmptyArray(offersData?.serviceRequestOffers);
  const coverBg = isEmptyArray(data?.serviceRequest?.photos)
    ? getAbsoluteHrefUrl(defaultCoverBgUrl)
    : data?.serviceRequest?.photos?.[0]?.url;

  useEffect(() => {
    if (state.value)
      toast({
        variant: 'success',
        title: 'Lien copié avec succès',
      });
  }, [state]);

  return (
    <>
      <Seo
        title={
          authorName
            ? meta.title(`${authorName} - ${data?.serviceRequest?.title}`)
            : ''
        }
        image={coverBg}
        description={meta.description(data?.serviceRequest?.description || '')}
      />
      <CenterContent className="container mt-6 max-w-5xl space-y-10 px-4 lg:min-w-[600px]">
        <AsyncWrapper isLoading={isInitialLoading} error={error}>
          <section
            aria-labelledby="service-request-main-infos"
            className="w-full"
          >
            <button
              onClick={router.back}
              className="mb-3 flex items-center gap-2"
            >
              <MoveLeft className="h-5 w-5" />
              <span>Retour</span>
            </button>
            {data?.serviceRequest?.photos &&
            data?.serviceRequest?.photos?.length > 0 ? (
              <ImageGridGallery
                className="h-64 w-full bg-gray-100 md:h-80"
                images={data?.serviceRequest?.photos}
              />
            ) : (
              <Image
                src={defaultCoverBgUrl}
                alt="Image artistique de fond"
                className="h-64 w-full rounded-lg border bg-gray-50 object-top shadow-sm md:h-80"
              />
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <Typography variant="small">
                  Publiée{' '}
                  {data?.serviceRequest?.createdAt &&
                    dateToReadableString(data?.serviceRequest?.createdAt)}
                </Typography>
                <div className="mt-1 flex items-center gap-2">
                  <Typography as="h2">{data?.serviceRequest?.title}</Typography>
                  <Badge
                    content={mapServiceRequestStatusToString(
                      data?.serviceRequest?.status
                    )}
                    variant={isStatusOpen ? 'primary' : 'danger'}
                  />
                </div>
                <Inline>
                  <GroupItem
                    isHoverDisabled
                    classNames={{
                      name: 'text-sm text-muted-foreground font-normal',
                    }}
                    iconBefore={<MapPin className="h-5 w-5" />}
                    name={data?.serviceRequest?.location?.name}
                  />
                  <GroupItem
                    isHoverDisabled
                    classNames={{
                      name: 'text-sm text-muted-foreground font-normal',
                    }}
                    iconBefore={<User2Icon className="h-5 w-5" />}
                    name={data?.serviceRequest?.nbProviderNeededFormattedText}
                  />
                </Inline>
              </div>
              <div className="flex flex-row-reverse items-center gap-2 sm:flex-row">
                <CanView allowedProfiles={['PROVIDER']}>
                  <MakeOfferModal>
                    <Button size="sm">Faire une offre</Button>
                  </MakeOfferModal>
                </CanView>
                {isAuthorMine && (
                  <Button
                    size="sm"
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
                <DropdownMenu>
                  <DropdownMenu.Trigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {isAuthorMine && (
                      <DropdownMenu.Item
                      // onClick={() => copyToClipboard(pageLink)}
                      >
                        Editer ma demande
                      </DropdownMenu.Item>
                    )}
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
                  <Typography className="font-semibold">
                    {data?.serviceRequest?.nbHoursFomattedText}
                  </Typography>
                }
              />
            </div>
            <Truncate hasEllipsisText lines={3} className="mt-3">
              {data?.serviceRequest?.description}
            </Truncate>
            <div className="mt-6">
              <Typography variant="subtle">Données personnelles</Typography>
              <div className="mt-3 flex w-full max-w-xl flex-wrap items-center justify-between gap-y-3">
                <User profile={data?.serviceRequest?.author?.profile} />
                {(isAuthorMine || isSelected) && (
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
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <EyeOffIcon className="h-4 w-4" />
                        Masqué jusqu'à la réservation
                      </div>
                    }
                  />
                )}
              </div>
            </div>
          </section>
        </AsyncWrapper>
        <AsyncWrapper isLoading={isInitialLoadingOffers} error={offersError}>
          <section aria-labelledby="comment-section" className="w-full">
            <Typography as="h3">Offres ({offersCount})</Typography>
            <div className="mt-6 border bg-white shadow-md sm:overflow-hidden sm:rounded-lg">
              <div className="px-4 py-6 sm:px-6">
                {!hasOffers && (
                  <EmptyState
                    icon={<FolderClock />}
                    name="Aucune offre trouvée"
                    description="Ici vous trouverez la liste des offres de service faits par des prestataires"
                    primaryAction={
                      <CanView allowedProfiles={['PROVIDER']} isPublic>
                        <LoginRedirect reason="make-service-request-offer">
                          <Button>Faire une offre</Button>
                        </LoginRedirect>
                      </CanView>
                    }
                  />
                )}
                {offersData?.serviceRequestOffers &&
                  offersData?.serviceRequestOffers?.length > 0 && (
                    <ul role="list" className="space-y-8">
                      {offersData?.serviceRequestOffers.map(offer => (
                        <li key={offer.id}>
                          <User profile={offer?.author?.profile} />
                          <div className="ml-10 mt-1">
                            <div className="mt-1 text-sm text-gray-700">
                              {htmlParse(offer?.text)}
                            </div>
                            <Inline className="mt-2 space-x-2 text-sm">
                              <span className="font-medium text-gray-500">
                                {dateToReadableString(offer?.createdAt)}
                              </span>
                              {isAuthorMine && (
                                <Button type="button" variant="ghost" size="sm">
                                  Sélectionner
                                </Button>
                              )}
                            </Inline>
                          </div>
                        </li>
                      ))}
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

    //Prefetch the query so it is already on the client side cache
    await ssg?.services.getServiceRequest.prefetch({
      slug: serviceRequestSlugQuery,
    });
    await ssg?.services.getServiceRequestOffers.prefetch({
      serviceRequestSlug: serviceRequestSlugQuery,
    });

    return { props: { serviceRequestSlugQuery, profile } };
  },
});

export default ServiceRequestPublicationPage;
