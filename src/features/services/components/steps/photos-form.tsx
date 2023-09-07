import { type TRPCClientErrorLike } from '@trpc/client';
import { Camera } from 'lucide-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, useZodForm } from '@/components/ui/form';
import { SectionMessage } from '@/components/ui/section-message';
import { DropzoneUpload, useUpload } from '@/components/ui/uploadthing';

import { type AppRouter } from '@/server/api/root';

import { usePublishServiceRequest } from '../../stores';
import { FixedFooterForm } from '../fixed-footer-form';

type PhotosFormProps = {
  error: TRPCClientErrorLike<AppRouter> | null;
  isLoading: boolean;
};

type PhotosFormData = {
  photoOne: File[];
  photoTwo: File[];
  photoThree: File[];
};

const PhotosForm = ({ error, isLoading }: PhotosFormProps) => {
  const router = useRouter();
  const { serviceSlug } = router.query as { serviceSlug: string };

  const form = useZodForm({
    mode: 'onChange',
  });

  const { control, setValue } = form;

  const { startUpload: startUploadPhotoOne, isUploading } = useUpload({
    endpoint: 'imageUploader',
    onSuccess(res) {
      setValue('photoOne', res);
    },
  });

  const onHandleSubmit = (formData: Partial<PhotosFormData>) => {
    console.log(formData);
    // void router.push(`/publish-service-request/${serviceSlug}/duration`);
  };

  return (
    <>
      {error && <SectionMessage title={error.message} appareance="danger" />}
      <Form form={form} onSubmit={onHandleSubmit}>
        <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3">
          <Controller
            control={control}
            name="photoOne"
            render={({ field: { onChange, value }, fieldState }) => {
              const fileValue = value as File[];
              return (
                <DropzoneUpload
                  isLoading={isUploading}
                  icon={<Camera className="h-7 w-7" />}
                  label="Ajouter une photo"
                  value={fileValue}
                  onChange={onChange}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="photoTwo"
            render={({ field: { onChange, value }, fieldState }) => {
              const fileValue = value as File[];
              return (
                <DropzoneUpload
                  icon={<Camera className="h-7 w-7" />}
                  label="Ajouter une photo"
                  value={fileValue}
                  onChange={onChange}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="photoThree"
            render={({ field: { onChange, value }, fieldState }) => {
              const fileValue = value as File[];
              return (
                <DropzoneUpload
                  icon={<Camera className="h-7 w-7" />}
                  label="Ajouter une photo"
                  value={fileValue}
                  onChange={onChange}
                />
              );
            }}
          />
        </div>
        <FixedFooterForm>
          <Button
            type="button"
            onClick={() => void router.back()}
            variant="ghost"
            size="lg"
          >
            Retour
          </Button>
          <Button size="lg">Publier ma demande</Button>
        </FixedFooterForm>
      </Form>
    </>
  );
};

export { PhotosForm };
