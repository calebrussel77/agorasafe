import { removeTags } from '@/utils/strings';

interface NewServiceRequestProfileReviewDetails {
  authorName: string;
  authorAvatar?: string | null;
  reviewText: string;
  targetSlug: string;
  serviceRequestTitle: string;
}

const reviewNotifications = {
  'new-service-request-profile-review': {
    title: 'Nouvel avis sur une demande',
    notificationDetails: (details: NewServiceRequestProfileReviewDetails) => ({
      imageUrl: details.authorAvatar,
      url: `/u/${details.targetSlug}`,
      message: `<span class="font-semibold">${
        details.authorName
      }</span> vous a attribué une note sur la demande <span class="font-semibold">${
        details.serviceRequestTitle
      }</span> ${
        details.reviewText ? `: ${removeTags(details.reviewText)}` : ''
      }`,
    }),
  },
} as const;

export { reviewNotifications };
