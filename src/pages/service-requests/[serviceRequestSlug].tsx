import {
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
import { z } from 'zod';

import { CanView } from '@/components/can-view';
import { AsyncWrapper } from '@/components/ui/async-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { GroupItem } from '@/components/ui/group-item';
import { IconContainer } from '@/components/ui/icon-container';
import { Image } from '@/components/ui/image';
import { Inline } from '@/components/ui/inline';
import { CenterContent } from '@/components/ui/layout';
import { Seo } from '@/components/ui/seo';
import { Truncate } from '@/components/ui/truncate';
import { Typography } from '@/components/ui/typography';
import { User } from '@/components/user';

import { MakeOfferModal } from '@/features/service-requests';
import {
  mapServiceRequestStatusToString,
  useGetServiceRequest,
  useServiceRequestOffers,
} from '@/features/services';

import { formatPhoneNumber } from '@/utils/misc';

import { formatDateToString } from '@/lib/date-fns';
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
  const { data, isInitialLoading, error } = useGetServiceRequest({
    slug: serviceRequestSlugQuery,
  });

  const {
    data: offersData,
    isInitialLoading: isInitialLoadingOffers,
    error: offersError,
  } = useServiceRequestOffers({
    serviceRequestSlug: serviceRequestSlugQuery,
  });

  const isAuthorMine =
    profile?.id === data?.serviceRequest?.author?.profile?.id;

  const offersCount = offersData?.serviceRequestOffers?.length;
  const isStatusOpen = data?.serviceRequest?.status === 'OPEN';
  const isSelected = data?.serviceRequest?.isProfileChoosed;

  return (
    <>
      <Seo
        title={meta.title(data?.serviceRequest?.title || '')}
        image={
          data?.serviceRequest?.photos
            ? data?.serviceRequest?.photos[0]?.url
            : undefined
        }
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
            <Image
              src="/images/artistique-cover-photo.jpg"
              alt="Image blanche"
              className="h-64 w-full rounded-lg border bg-gray-50 object-top shadow-sm md:h-80"
            />
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <Typography variant="small">
                  Publiée{' '}
                  {data?.serviceRequest?.createdAt &&
                    formatDateToString(data?.serviceRequest?.createdAt, 'PP')}
                </Typography>
                <div className="mt-1 flex items-center gap-2">
                  <Typography as="h2">{data?.serviceRequest?.title}</Typography>
                  <Badge
                    content={mapServiceRequestStatusToString(
                      data?.serviceRequest?.status
                    )}
                    variant={isStatusOpen ? 'primary' : 'outline'}
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
                    variant={isStatusOpen ? 'outline' : 'default'}
                  >
                    {isStatusOpen ? 'Annuler ma demande' : 'Démander à nouveau'}
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="mt-3">
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
                {offersData?.serviceRequestOffers?.length == 0 && (
                  <EmptyState
                    icon={<FolderClock />}
                    name="Aucune offre trouvée"
                    description="Ici vous trouverez la liste des offres de service faits par des prestataires"
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
                                {formatDateToString(offer?.createdAt)}
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
              {/* <div className="bg-gray-50 px-4 py-6 sm:px-6">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <Avatar className="h-10 w-10 rounded-full" alt="" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <form action="#">
                      <div>
                        <label htmlFor="comment" className="sr-only">
                          About
                        </label>
                        <textarea
                          id="comment"
                          name="comment"
                          rows={3}
                          className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                          placeholder="Add a note"
                          defaultValue={''}
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <a
                          href="#"
                          className="group inline-flex items-start space-x-2 text-sm text-gray-500 hover:text-gray-900"
                        >
                          <FileQuestionIcon
                            className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                          <span>Some HTML is okay.</span>
                        </a>
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                          Comment
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div> */}
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
  shouldUseSSG: true,
  resolver: async ({ ctx, profile, ssg }) => {
    const result = querySchema.safeParse(ctx.query);

    if (!result.success || !profile) return { notFound: true };

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
