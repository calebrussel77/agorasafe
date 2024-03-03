import {
  addViewSchema,
  getDaysSchema,
  trackActionSchema,
  trackSearchSchema,
  trackShareSchema,
} from '../../../validations/track.validations';
import { profileProcedure, publicProcedure, router } from '../trpc';

export const trackRouter = router({
  getDays: profileProcedure
    .input(getDaysSchema)
    .query(({ input, ctx }) => ctx.track.getDays(input)),
  addView: publicProcedure
    .input(addViewSchema)
    .mutation(({ input, ctx }) => ctx.track.view(input)),
  trackShare: publicProcedure
    .input(trackShareSchema)
    .mutation(({ input, ctx }) => ctx.track.share(input)),
  addAction: publicProcedure
    .input(trackActionSchema)
    .mutation(({ input, ctx }) => ctx.track.action(input)),
  trackSearch: publicProcedure
    .input(trackSearchSchema)
    .mutation(({ input, ctx }) => ctx.track.search(input)),
});
