import { env } from '@/env.mjs';
import { createNextPageApiHandler } from 'uploadthing/next-legacy';

import { ourFileRouter } from '@/server/uploadthing';

const handler = createNextPageApiHandler({
  router: ourFileRouter,
  config: {
    uploadthingId: env.UPLOADTHING_APP_ID,
    uploadthingSecret: env.UPLOADTHING_SECRET,
  },
});

export default handler;
