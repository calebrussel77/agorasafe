import { isDev } from '@/constants';
import { createNextApiHandler } from '@trpc/server/adapters/next';

import {
  ALLOWED_SENTRY_EXCEPTION_CODE_REPORTS,
  sentryCaptureException,
} from '@/lib/sentry';

import { appRouter } from '@/server/api/root';
import { handleTRPCError } from '@/server/utils/error-handling';
import { createContext } from '@/server/api/create-context';

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext,
  onError: ({ path, error, ctx }) => {
    if (isDev) {
      console.error(
        `❌ tRPC failed on ${path ?? '<no-path>'}: ${error.cause?.message}`
      );
    }

    // Capture all needed errors without zod errors, and send to Sentry
    if (ALLOWED_SENTRY_EXCEPTION_CODE_REPORTS.includes(error.code)) {
      sentryCaptureException({ error, ctx, path });
    }

    handleTRPCError(error);
  },
});
