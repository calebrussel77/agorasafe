import { isDev } from '@/constants';
import { env } from '@/env.mjs';
import { createNextApiHandler } from '@trpc/server/adapters/next';

import {
  ALLOWED_SENTRY_EXCEPTION_CODE_REPORTS,
  sentryCaptureException,
} from '@/lib/sentry';

import { appRouter } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';
import { handleTRPCError } from '@/server/api/utils/error-handling';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

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
