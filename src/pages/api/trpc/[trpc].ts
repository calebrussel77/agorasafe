import { isDev } from '@/constants';
import { createNextApiHandler } from '@trpc/server/adapters/next';

import {
  ALLOWED_SENTRY_EXCEPTION_CODE_REPORTS,
  sentryCaptureException,
} from '@/lib/sentry';

import { appRouter } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';
import { handleTRPCError } from '@/server/utils/error-handling';

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError: ({ path, error, ctx }) => {
    if (isDev) {
      console.error(
        `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`
      );
    }

    // Capture all need errors without zod error, and send to Sentry
    if (ALLOWED_SENTRY_EXCEPTION_CODE_REPORTS.includes(error.code)) {
      sentryCaptureException({ error, ctx, path });
    }

    handleTRPCError(error);
  },
});
