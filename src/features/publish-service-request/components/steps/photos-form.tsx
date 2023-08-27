import { type TRPCClientErrorLike } from '@trpc/client';
import { Camera } from 'lucide-react';
import { useRouter } from 'next/router';
import { Controller } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import {
  FileUpload,
  FileUploadButton,
  FileWithPreviewBlob,
  FileWithPreviewBlobType,
} from '@/components/ui/file-upload';
import { Form, useZodForm } from '@/components/ui/form';
import { Image } from '@/components/ui/image';
import { SectionMessage } from '@/components/ui/section-message';

import { type AppRouter } from '@/server/api/root';

import { useCatchNavigation } from '@/hooks/use-catch-navigation';

import {
  type PublishServiceRequest,
  usePublishServiceRequest,
} from '../../stores';
import { FixedFooterForm } from '../fixed-footer-form';

type PhotosFormProps = {
  error: TRPCClientErrorLike<AppRouter> | null;
  isLoading: boolean;
};

type Address = Pick<
  PublishServiceRequest,
  'photoOne' | 'photoTwo' | 'photoThree'
>;

const PhotosForm = ({ error, isLoading }: PhotosFormProps) => {
  const router = useRouter();
  const { serviceSlug } = router.query as { serviceSlug: string };

  const { updateServiceRequest, serviceRequest } = usePublishServiceRequest();

  const form = useZodForm({
    mode: 'onChange',
    defaultValues: {
      photoOne: serviceRequest?.photoOne || '',
      photoTwo: serviceRequest?.photoTwo || '',
      photoThree: serviceRequest?.photoThree || '',
    },
  });

  const {
    control,
    formState: { isDirty, isSubmitted },
  } = form;

  const onHandleSubmit = (formData: Address) => {
    updateServiceRequest(formData);
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
            render={({ field: { ref, onChange, value }, fieldState }) => {
              const fileValue = value as FileWithPreviewBlob;
              return (
                <FileUpload
                  ref={ref}
                  onChange={onChange}
                  label="Télécharger une image"
                  icon={<Camera className="h-6 w-6" />}
                  preview={null}
                  value={fileValue as never}
                >
                  {value
                    ? ({ openFile, onRemoveFile }) => (
                        <FileUploadButton
                          onRemoveFile={onRemoveFile}
                          openFile={openFile}
                        >
                          <Image
                            src={fileValue?.preview as string}
                            className="object-cover"
                            alt="sss"
                          />
                        </FileUploadButton>
                      )
                    : undefined}
                </FileUpload>
              );
            }}
          />
          <Controller
            control={control}
            name="photoTwo"
            render={({ field: { ref, onChange, value }, fieldState }) => {
              const fileValue = value as FileWithPreviewBlob;
              return (
                <FileUpload
                  ref={ref}
                  onChange={onChange}
                  label="Télécharger une image"
                  icon={<Camera className="h-6 w-6" />}
                  preview={null}
                  value={fileValue as never}
                >
                  {value
                    ? ({ openFile }) => (
                        <FileUploadButton openFile={openFile}>
                          <Image
                            src={fileValue?.preview as string}
                            className="object-cover"
                            alt="sss"
                          />
                        </FileUploadButton>
                      )
                    : undefined}
                </FileUpload>
              );
            }}
          />
          <Controller
            control={control}
            name="photoThree"
            render={({ field: { ref, onChange, value }, fieldState }) => {
              const fileValue = value as FileWithPreviewBlob;
              return (
                <FileUpload
                  ref={ref}
                  onChange={onChange}
                  label="Télécharger une image"
                  icon={<Camera className="h-6 w-6" />}
                  preview={null}
                  value={fileValue as never}
                >
                  {value
                    ? ({ openFile }) => (
                        <FileUploadButton openFile={openFile}>
                          <Image
                            src={fileValue?.preview as string}
                            className="object-cover"
                            alt="sss"
                          />
                        </FileUploadButton>
                      )
                    : undefined}
                </FileUpload>
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
