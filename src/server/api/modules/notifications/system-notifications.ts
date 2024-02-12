interface NewServiceRequestSystemDetails {
  serviceRequestId: string;
  serviceRequestSlug: string;
  serviceRequestTitle: string;
}

const agorasafeLogo = '/images/agorasafe-logo-symbole-primary.png';

const systemNotifications = {
  'close-service-request-expired': {
    title: 'Expiration de votre demande',
    notificationDetails: (details: NewServiceRequestSystemDetails) => ({
      imageUrl: agorasafeLogo,
      url: `/service-requests/${details.serviceRequestId}/${details.serviceRequestSlug}`,
      message: `Votre demande <span class="font-semibold">${details.serviceRequestTitle}</span> est arrivée à expiration : Elle a été clôturée. `,
    }),
  },
} as const;

export { systemNotifications };
