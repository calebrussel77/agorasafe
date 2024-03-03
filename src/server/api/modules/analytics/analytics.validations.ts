import { ServiceRequestStatus } from '@prisma/client';
import { z } from 'zod';

export type GetServiceRequestsCountRangeInput = z.infer<
  typeof GetServiceRequestsCountRangeSchema
>;
export const GetServiceRequestsCountRangeSchema = z.object({
  status: z.nativeEnum(ServiceRequestStatus).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  isAll: z.boolean().optional(),
});

export type GetProfileViewCountRangeInput = z.infer<
  typeof getProfileViewCountRangeSchema
>;
export const getProfileViewCountRangeSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  isAll: z.boolean().optional(),
});

export type GetAcceptedProposalsCountInput = z.infer<
  typeof getAcceptedProposalsCountSchema
>;
export const getAcceptedProposalsCountSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  isAll: z.boolean().optional(),
});
