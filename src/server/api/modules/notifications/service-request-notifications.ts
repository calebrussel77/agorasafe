import { DEFAULT_SERVICE_REQUEST_COVER_IMAGE } from '@/features/service-requests';

interface ServiceRequestReservationNotificationDetails {
  profileName: string;
  serviceRequestImageUrl?: string;
  serviceRequestId: string;
  serviceRequestSlug: string;
  serviceRequestTitle: string;
}

const serviceRequestNotifications = {
  'new-service-request-reservation': {
    title: 'Nouvelle réservation de service',
    notificationDetails: (
      details: ServiceRequestReservationNotificationDetails
    ) => ({
      imageUrl:
        details.serviceRequestImageUrl || DEFAULT_SERVICE_REQUEST_COVER_IMAGE,
      url: `/service-requests/${details.serviceRequestId}/${details.serviceRequestSlug}`,
      message: `<span class="font-semibold">${details.profileName}</span> vous a réservé comme prestataire sur sa demande <span class="font-semibold">${details.serviceRequestTitle}</span>`,
    }),
  },
  'cancel-service-request-reservation': {
    title: 'Annulation de votre réservation',
    notificationDetails: (
      details: ServiceRequestReservationNotificationDetails
    ) => ({
      imageUrl:
        details.serviceRequestImageUrl || DEFAULT_SERVICE_REQUEST_COVER_IMAGE,
      url: `/service-requests/${details.serviceRequestId}/${details.serviceRequestSlug}`,
      message: `<span class="font-semibold">${details.profileName}</span> a annulé votre réservation comme prestataire sur sa demande <span class="font-semibold">${details.serviceRequestTitle}</span>`,
    }),
  },
} as const;

export { serviceRequestNotifications };
