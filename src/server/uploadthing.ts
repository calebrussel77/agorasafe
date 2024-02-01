import { type FileRouter, createUploadthing } from 'uploadthing/next-legacy';

import { getServerAuthSession } from './auth';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  serviceRequestPhotos: f({ image: { maxFileSize: '4MB', maxFileCount: 3 } })
    .middleware(async ctx => {
      const session = await getServerAuthSession(ctx);

      if (!session) throw new Error('Unauthorized');

      return { userId: session.user?.id };
    })
    .onUploadComplete(({ file }) => {
      console.log('file', file);
    }),
  profilePhotos: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async ctx => {
      // This code runs on your server before upload
      const session = await getServerAuthSession(ctx);

      // If you throw, the user will not be able to upload
      if (!session) throw new Error('Unauthorized');

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user?.id };
    })
    .onUploadComplete(({ file }) => {
      console.log('file', file);
    }),
  feedbackImages: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
  }).onUploadComplete(({ file }) => {
    console.log('file', file);
  }),
  conversationFiles: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
    text: { maxFileSize: '4MB', maxFileCount: 1 },
    pdf: { maxFileSize: '4MB', maxFileCount: 1 },
  })
    .middleware(async ctx => {
      // This code runs on your server before upload
      const session = await getServerAuthSession(ctx);

      // If you throw, the user will not be able to upload
      if (!session) throw new Error('Unauthorized');

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user?.id };
    })
    .onUploadComplete(({ file }) => {
      console.log('file', file);
    }),
} as FileRouter;

// satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
