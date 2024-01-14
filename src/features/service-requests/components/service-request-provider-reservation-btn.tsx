import { produce } from 'immer';
import { UserMinus, UserPlus } from 'lucide-react';
import React, { type MouseEventHandler, type PropsWithChildren } from 'react';

import { ActionTooltip } from '@/components/action-tooltip';
import { Button, type ButtonProps } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';

import { LoginRedirect } from '@/features/auth';

import { api } from '@/utils/api';

import { useCurrentUser } from '@/hooks/use-current-user';

type ServiceRequestProviderReservationBtnProps = {
  className?: string;
  serviceRequestId: string;
  providerProfileId: string;
  proposalId?: string;
  onToggleReservation?: () => void;
} & Omit<ButtonProps, 'children'>;

const ServiceRequestProviderReservationBtn = ({
  onToggleReservation,
  serviceRequestId,
  providerProfileId,
  proposalId,
  ...props
}: PropsWithChildren<ServiceRequestProviderReservationBtnProps>) => {
  const { profile, session } = useCurrentUser();
  const queryUtils = api.useContext();

  const { data } = api.serviceRequests.getReservedProviders.useQuery(
    { id: serviceRequestId },
    { enabled: !!serviceRequestId }
  );

  const reservations = data?.reservedProviders || [];

  const isReserved = reservations?.some(
    el => el.profile.id === providerProfileId
  );

  const isServiceRequestOwner = profile?.id === data?.author?.profile?.id;

  const btnMessage = isReserved ? 'Annuler la réservation' : 'Réserver';

  const {
    mutate: mutateToggleReservation,
    isLoading: isLoadingToggleReservation,
  } = api.serviceRequests.toggleReservation.useMutation({
    // async onMutate() {
    //   await queryUtils.serviceRequests.getReservedProviders.cancel({
    //     id: serviceRequestId,
    //   });
    //   await queryUtils.serviceRequests.getStats.cancel({
    //     id: serviceRequestId,
    //   });

    //   const prevReservationData =
    //     queryUtils.serviceRequests.getReservedProviders.getData({
    //       id: serviceRequestId,
    //     });

    //   const prevStats = queryUtils.serviceRequests.getStats.getData({
    //     id: serviceRequestId,
    //   });

    //   queryUtils.serviceRequests.getReservedProviders.setData(
    //     { id: serviceRequestId },
    //     produce(oldData => {
    //       if (!oldData) {
    //         return oldData;
    //       }

    //       if (!isReserved) {
    //         oldData.reservedProviders.push({
    //           profession: '',
    //           proposal: null,
    //           profile: {
    //             id: providerProfileId,
    //             slug: '',
    //             name: '',
    //             avatar: null,
    //             type: 'CUSTOMER',
    //             phone: null,
    //             deletedAt: null,
    //             bannedAt: null,
    //             isMuted: null,
    //             user: { id: '', role: 'MEMBER' },
    //             location: null,
    //             _count: { receivedReviews: 0 },
    //           },
    //           skills: [],
    //         });
    //       }
    //       oldData.reservedProviders = oldData.reservedProviders.filter(
    //         item => item.profile.id !== providerProfileId
    //       );
    //     })
    //   );

    //   return { prevReservationData, prevStats };
    // },
    onError(error, _variables, context) {
      // queryUtils.serviceRequests.getReservedProviders.setData(
      //   { id: serviceRequestId },
      //   context?.prevReservationData
      // );
      // queryUtils.serviceRequests.getStats.setData(
      //   { id: serviceRequestId },
      //   context?.prevStats
      // );
      toast({
        variant: 'danger',
        title: 'Une erreur est survenue',
        description: error?.message,
      });
    },
    async onSuccess(data, variables) {
      if (variables.proposalId) {
        await queryUtils.serviceRequests.getProposals.invalidate({
          id: serviceRequestId,
        });
      }
      await queryUtils.serviceRequests.getReservedProviders.invalidate({
        id: serviceRequestId,
      });
      await queryUtils.serviceRequests.getStats.invalidate({
        id: serviceRequestId,
      });
      toast({
        delay: 2000,
        variant: 'success',
        title: data.message,
      });
    },
  });

  const handleReservationClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault();
    e.stopPropagation();
    mutateToggleReservation({
      serviceRequestId,
      providerProfileId,
      proposalId,
    });
    onToggleReservation?.();
  };

  if (!session || !profile) return null;

  //If the current provider user is the same as the user connected, render nothing
  if (data?.author?.profile?.id === providerProfileId) return null;

  //If it is not the owner of the service request render nothing
  if (!isServiceRequestOwner) return null;

  if (data?.status === 'CLOSED') return null;

  return (
    <LoginRedirect reason="reserve-service-request-provider">
      <ActionTooltip label={btnMessage}>
        <Button
          {...props}
          variant={isReserved ? 'outline' : 'default'}
          size="sm"
          isLoading={isLoadingToggleReservation}
          onClick={handleReservationClick}
          className="ml-1"
        >
          {!isReserved ? (
            <>
              <UserPlus className="h-4 w-4" />
              Réserver
            </>
          ) : (
            <>
              <UserMinus className="h-4 w-4" />
              Annuler la réservation
            </>
          )}
        </Button>
      </ActionTooltip>
    </LoginRedirect>
  );
};

export { ServiceRequestProviderReservationBtn };
