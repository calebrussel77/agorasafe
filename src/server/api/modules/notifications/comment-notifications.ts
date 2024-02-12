import { removeTags } from '@/utils/strings';

interface NewServiceRequestCommentDetails {
  profileName: string;
  profileAvatar?: string | null;
  commentText: string;
  serviceRequestId: string;
  serviceRequestSlug: string;
  serviceRequestTitle: string;
}

const commentNotifications = {
  'new-service-request-comment': {
    title: 'Nouveaux commentaires sur votre demande',
    notificationDetails: (details: NewServiceRequestCommentDetails) => ({
      imageUrl: details.profileAvatar,
      url: `/service-requests/${details.serviceRequestId}/${details.serviceRequestSlug}`,
      message: `<span class="font-semibold">${
        details.profileName
      }</span> a commenté votre demande <span class="font-semibold">${
        details.serviceRequestTitle
      }</span> : ${removeTags(details.commentText)}`,
    }),
  },
} as const;

export { commentNotifications };
