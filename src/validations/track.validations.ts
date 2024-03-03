import { z } from 'zod';

import { trackedReasons } from '@/features/auth';

export const getViewPeerDaySchema = z.object({
  type: z.enum(['ProfileView', 'ServiceRequestView']),
  entityType: z.enum(['Profile', 'ServiceRequest']),
  entityId: z.string(),
  details: z.object({}).passthrough().optional(),
});

export const addViewSchema = z.object({
  type: z.enum(['ProfileView', 'ServiceRequestView']),
  entityType: z.enum(['Profile', 'ServiceRequest']),
  entityId: z.string(),
  details: z.object({}).passthrough().optional(),
});

export const getDaysSchema = z.object({
  namespace: z.enum([
    'views',
    'actions',
    'activities',
    'modelEvents',
    'modelVersionEvents',
    'partnerEvents',
    'userActivities',
    'resourceReviews',
    'comments',
    'commentEvents',
    'posts',
    'userEngagements',
    'shares',
    'files',
    'search',
  ]),
  nDays: z.number(),
  profileId: z.string().optional(),
});
export type GetDaysInput = z.infer<typeof getDaysSchema>;

export type AddViewInput = z.infer<typeof addViewSchema>;

export type TrackShareInput = z.infer<typeof trackShareSchema>;
export const trackShareSchema = z.object({
  platform: z.enum(['linkedIn', 'twitter', 'whatsapp', 'clipboard']),
  url: z.string().url().trim().nonempty(),
});

export type TrackSearchInput = z.infer<typeof trackSearchSchema>;
export const trackSearchSchema = z.object({
  query: z.string().trim(),
  index: z.string(),
  filters: z.object({}).passthrough().optional(),
});

// action tracking schemas

const tipClickSchema = z.object({
  type: z.literal('Tip_Click'),
  details: z
    .object({
      toUserId: z.number(),
      entityId: z.number().nullish(),
      entityType: z.string().nullish(),
    })
    .optional(),
});
const tipConfirmSchema = z.object({
  type: z.literal('Tip_Confirm'),
  details: z
    .object({
      toUserId: z.number(),
      entityId: z.number().nullish(),
      entityType: z.string().nullish(),
      amount: z.number(),
    })
    .optional(),
});
const tipInteractiveClickSchema = z.object({
  type: z.literal('TipInteractive_Click'),
  details: z
    .object({
      toUserId: z.number(),
      entityId: z.number(),
      entityType: z.string(),
      amount: z.number(),
    })
    .optional(),
});
const tipInteractiveCancelSchema = z.object({
  type: z.literal('TipInteractive_Cancel'),
  details: z
    .object({
      toUserId: z.number(),
      entityId: z.number(),
      entityType: z.string(),
      amount: z.number(),
    })
    .optional(),
});
const notEnoughFundsSchema = z.object({
  type: z.literal('NotEnoughFunds'),
  details: z.object({ amount: z.number() }).optional(),
});
const purchaseFundsCancelSchema = z.object({
  type: z.literal('PurchaseFunds_Cancel'),
  details: z.object({ step: z.number() }).optional(),
});
const purchaseFundsConfirmSchema = z.object({
  type: z.literal('PurchaseFunds_Confirm'),
  details: z
    .object({
      priceId: z.string().optional(),
      buzzAmount: z.number(),
      unitAmount: z.number(),
      method: z.string(),
    })
    .optional(),
});
const loginRedirectSchema = z.object({
  type: z.literal('LoginRedirect'),
  reason: z.enum(trackedReasons),
});
export type TrackActionInput = z.infer<typeof trackActionSchema>;
export const trackActionSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('AddToBounty_Click') }),
  z.object({ type: z.literal('AddToBounty_Confirm') }),
  z.object({ type: z.literal('AwardBounty_Click') }),
  z.object({ type: z.literal('AwardBounty_Confirm') }),
  tipClickSchema,
  tipConfirmSchema,
  tipInteractiveClickSchema,
  tipInteractiveCancelSchema,
  notEnoughFundsSchema,
  purchaseFundsCancelSchema,
  purchaseFundsConfirmSchema,
  loginRedirectSchema,
]);
