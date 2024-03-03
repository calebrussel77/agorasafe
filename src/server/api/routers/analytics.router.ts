import {
  GetServiceRequestsCountRangeSchema,
  getCustomerProfileAnalyticsHandler,
  getProfileViewCountRangeHandler,
  getProfileViewCountRangeSchema,
  getProviderProfileAnalyticsHandler,
  getServiceRequestsCountRangeHandler,
} from '../modules/analytics';
import { profileProcedure, router } from '../trpc';

export const analyticsRouter = router({
  getServiceRequestsCountRange: profileProcedure
    .input(GetServiceRequestsCountRangeSchema)
    .query(getServiceRequestsCountRangeHandler),

  getProfileViewCountRange: profileProcedure
    .input(getProfileViewCountRangeSchema)
    .query(getProfileViewCountRangeHandler),

  getCustomerAnalytics: profileProcedure.query(
    getCustomerProfileAnalyticsHandler
  ),

  getProviderAnalytics: profileProcedure.query(
    getProviderProfileAnalyticsHandler
  ),
});
