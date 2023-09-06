import { generateComponents } from '@uploadthing/react';
import { generateReactHelpers } from '@uploadthing/react/hooks';
import { utapi } from 'uploadthing/server';

import { type OurFileRouter } from '@/server/uploadthing';

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>();

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();

export async function deleteFilesFromUrl(fileKeys: string[] | string) {
  const response = await utapi.deleteFiles(fileKeys);
  return response;
}

export type ValidFileTypes =
  | 'image'
  | 'video'
  | 'audio'
  | 'blob'
  | 'pdf'
  | 'text';
