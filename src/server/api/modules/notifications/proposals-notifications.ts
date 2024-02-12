import { removeTags } from '@/utils/strings';

interface NewServiceRequestProposalDetails {
  profileName: string;
  profileAvatar?: string | null;
  proposalText: string;
  serviceRequestId: string;
  serviceRequestSlug: string;
  serviceRequestTitle: string;
}

const proposalNotifications = {
  'new-service-request-proposal': {
    title: 'Nouvelles propositions sur votre demande',
    notificationDetails: (details: NewServiceRequestProposalDetails) => ({
      imageUrl: details.profileAvatar,
      url: `/service-requests/${details.serviceRequestId}/${details.serviceRequestSlug}`,
      message: `<span class="font-semibold">${
        details.profileName
      }</span> a fait une proposition sur votre demande <span class="font-semibold">${
        details.serviceRequestTitle
      }</span> : ${removeTags(details.proposalText)}`,
    }),
  },
} as const;

export { proposalNotifications };
