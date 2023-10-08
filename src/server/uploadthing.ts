import { type FileRouter, createUploadthing } from 'uploadthing/next-legacy';

import { getServerAuthSession } from './auth';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  serviceRequestPhotos: f({ image: { maxFileSize: '4MB', maxFileCount: 3 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ctx => {
      // This code runs on your server before upload
      const session = await getServerAuthSession(ctx);

      // If you throw, the user will not be able to upload
      if (!session) throw new Error('Unauthorized');

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id };
    })
    .onUploadComplete(({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log('Upload complete for userId:', metadata.userId);
      console.log('file', file);
    }),
  profilePhotos: f({ image: { maxFileSize: '4MB', maxFileCount: 3 } })
    // Set permissions and file types for this FileRoute
    .middleware(async ctx => {
      // This code runs on your server before upload
      const session = await getServerAuthSession(ctx);

      // If you throw, the user will not be able to upload
      if (!session) throw new Error('Unauthorized');

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id };
    })
    .onUploadComplete(({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log('Upload complete for userId:', metadata.userId);
      console.log('file', file);
    }),
  conversationFiles: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
    text: { maxFileSize: '4MB', maxFileCount: 1 },
    pdf: { maxFileSize: '4MB', maxFileCount: 1 },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ctx => {
      // This code runs on your server before upload
      const session = await getServerAuthSession(ctx);

      // If you throw, the user will not be able to upload
      if (!session) throw new Error('Unauthorized');

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id };
    })
    .onUploadComplete(({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log('Upload complete for userId:', metadata.userId);
      console.log('file', file);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
