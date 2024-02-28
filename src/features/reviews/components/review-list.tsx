import { Edit, MoreHorizontal, ServerCrash, Trash } from 'lucide-react';
import React, { type PropsWithChildren, cloneElement } from 'react';

import { DaysFromNow } from '@/components/days-from-now';
import { InViewLoader } from '@/components/in-view/in-view-loader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { triggerRoutedDialog } from '@/components/ui/dialog';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/ui/empty-state';
import { Icons } from '@/components/ui/icons';
import { Inline } from '@/components/ui/inline';
import { CenterContent } from '@/components/ui/layout';
import { Rating } from '@/components/ui/rating';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import { Truncate } from '@/components/ui/truncate';
import { User } from '@/components/user';

import { api } from '@/utils/api';

import { dateIsAfter } from '@/lib/date-fns';
import { htmlParse } from '@/lib/html-helper';

import { useCurrentUser } from '@/hooks/use-current-user';

import { useGetInfiniteReviews } from '../hooks';

interface ReviewListProps {
  className?: string;
  profileSlug?: string;
}

const ReviewList = ({ profileSlug }: PropsWithChildren<ReviewListProps>) => {
  const { session, profile } = useCurrentUser();
  const queryUtils = api.useContext();

  const { reviews, fetchNextPage, hasNextPage, isRefetching, status } =
    useGetInfiniteReviews({ profileSlug });

  const deleteReviewMutation = api.reviews.delete.useMutation({
    onError(error) {
      toast({
        variant: 'danger',
        title: 'Une erreur est survenue',
        description: error?.message,
      });
    },
    async onSuccess() {
      await queryUtils.reviews.getInfinite.invalidate({ profileSlug });
      await queryUtils.profiles.getStats.invalidate({ slug: profileSlug });
      toast({
        variant: 'success',
        title: 'Votre avis à bien été supprimé',
      });
    },
  });

  const isAdmin = session?.user?.role === 'ADMIN';

  if (status === 'loading') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Spinner className="my-4" variant="ghost" />
        <p className="text-xs text-zinc-500">Chargement des notes et avis...</p>
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <ServerCrash className="my-4 h-7 w-7 text-zinc-500" />
        <p className="text-xs text-zinc-500">Une erreur s'est produite!</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-2 divide-y divide-gray-200">
        {reviews?.map(review => {
          const isOwner = review?.author?.id === profile?.id;
          const canDeleteReview = isAdmin || isOwner;
          const canEditReview = isOwner;
          const href = `/service-requests/${review?.serviceRequest?.id}/${review?.serviceRequest?.slug}`;
          const isModified = dateIsAfter(review.updatedAt, review.createdAt);

          const reviewOptions = [
            {
              label: 'Modifier',
              canView: canEditReview,
              onClick: () =>
                //TODO: Fix this ! it does'nt add the reviewId on the query
                triggerRoutedDialog({
                  name: 'reviewForm',
                  state: {
                    profileId: review?.reviewedProfile?.id as string,
                    rating: review.rating,
                    details: review.details as string,
                    serviceRequestId: review?.serviceRequest?.id as string,
                    reviewId: review?.id,
                  },
                }),
              icon: <Edit />,
            },
            {
              label: 'Supprimer',
              canView: canDeleteReview,
              onClick: () => deleteReviewMutation.mutate({ id: review?.id }),
              icon: <Trash />,
            },
          ];

          return (
            <div key={review.id} className="w-full">
              <div className="space-y-2 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <User
                    size="xl"
                    avatarProps={{ size: 'md' }}
                    profile={review.author}
                    subText={
                      <Inline className="text-xs text-muted-foreground">
                        <DaysFromNow
                          date={review.createdAt}
                          className="flex justify-end"
                        />
                        {isModified ? <span>(Modifié)</span> : null}
                      </Inline>
                    }
                  />
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
                    <DropdownMenu.Content>
                      <div className="flex flex-col space-y-1">
                        {reviewOptions
                          .filter(el => el.canView)
                          .map(({ label, onClick, icon }) => (
                            <DropdownMenu.Item
                              key={label}
                              className="default__transition flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-sm text-gray-900 hover:bg-gray-100"
                              onClick={onClick}
                            >
                              {cloneElement(icon, {
                                className: 'h-4 w-4 md:h-5 md:w-5',
                              })}
                              {label}
                            </DropdownMenu.Item>
                          ))}
                      </div>
                    </DropdownMenu.Content>
                  </DropdownMenu>
                </div>
                <Rating
                  readonly
                  initialRating={review?.rating ?? 1}
                  size="md"
                />
                <Badge
                  content={review?.serviceRequest?.title ?? ''}
                  maxWidth="lg"
                  size="lg"
                  truncate
                  className="px-3 py-2"
                />
                {review?.details ? (
                  <Truncate lines={3} hasEllipsisText>
                    {htmlParse(review.details)}
                  </Truncate>
                ) : (
                  '...'
                )}
              </div>
              <Button
                size="sm"
                href={href}
                variant="link"
                className="-mx-1 mt-3"
              >
                Voir la demande
              </Button>
            </div>
          );
        })}
      </div>
      {hasNextPage && (
        <InViewLoader loadFn={fetchNextPage} loadCondition={!isRefetching}>
          <CenterContent className="my-3">
            <Spinner variant="ghost" />
          </CenterContent>
        </InViewLoader>
      )}
      {reviews?.length === 0 && (
        <EmptyState
          className="mt-6 px-3"
          icon={<Icons.message />}
          name="Aucun avis reçu"
          description="Ce profil n'a encore reçu aucun avis."
        />
      )}
    </>
  );
};

export { ReviewList };
