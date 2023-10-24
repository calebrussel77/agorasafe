import { type UploadFileResponse } from 'uploadthing/client';

import { sentryCaptureException } from '@/lib/sentry';
import { useUploadThing } from '@/lib/uploadthing';

import { type OurFileRouter } from '@/server/uploadthing';

import { toast } from '../toast';

type UseUploadProps = {
  onSuccess?: (res: UploadFileResponse[] | undefined) => void;
  onError?: (error: Error) => void;
  onStart?: (filename: string) => void;
  onProgress?: (progress: number) => void;
};

const useUpload = <TEndpoint extends keyof OurFileRouter>({
  endpoint,
  onSuccess,
  onError,
  onStart,
  onProgress,
}: UseUploadProps & { endpoint: TEndpoint }) => {
  const response = useUploadThing(endpoint, {
    onClientUploadComplete: res => {
      onSuccess && onSuccess(res);
    },
    onUploadError: e => {
      sentryCaptureException(e);
      console.error(`[UPLOAD-ERROR]`, e);
      if (!onError) {
        toast({
          variant: 'danger',
          title: 'Erreur de chargement du fichier',
          description:
            'Une erreur est survenue lors du chargement de votre fichier. Réessayez plus tard.',
        });
      }
      onError && onError(e);
    },
    onUploadBegin: filename => {
      onStart && onStart(filename);
    },
    onUploadProgress(p) {
      onProgress && onProgress(p);
    },
  });

  return response;
};

export { useUpload };
