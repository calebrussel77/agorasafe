import { Camera } from 'lucide-react';
import { useRouter } from 'next/router';
import { useTransition } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, useZodForm } from '@/components/ui/form';
import { HelperMessage } from '@/components/ui/helper-message';
import { FullSpinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import { DropzoneUpload, useUpload } from '@/components/ui/uploadthing';

import { generateArray } from '@/utils/misc';
import { isArrayOfFile, isEmptyArray } from '@/utils/type-guards';

import { usePublishServiceRequest } from '../../stores';
import { type PublishServiceRequestInputs } from '../../types';
import { FixedFooterForm } from '../fixed-footer-form';

const photosFormSchema = z.object({
  photos: z.array(z.unknown()).optional().nullable().default(null),
});

type PhotosFormData = z.infer<typeof photosFormSchema>;
type PhotosFormProps = {
  prevStep: () => void;
  onSubmit: (formData: PublishServiceRequestInputs) => void;
  isLoading?: boolean;
};

const PhotosForm = ({ prevStep, onSubmit, isLoading }: PhotosFormProps) => {
  const router = useRouter();
  const categorySlugQuery = router?.query?.category as string;

  const [isPending, startTransition] = useTransition();

  const { serviceRequest: _serviceRequest } = usePublishServiceRequest();

  const serviceRequest = _serviceRequest?.[categorySlugQuery];

  const form = useZodForm({
    schema: photosFormSchema,
    defaultValues: {
      photos: generateArray(3).map(e => [e]),
    },
  });

  const { control } = form;
  const { fields } = useFieldArray({ control, name: 'photos' });

  const { startUpload, isUploading } = useUpload({
    endpoint: 'serviceRequestPhotos',
    onError(error) {
      toast({
        variant: 'danger',
        title: "Une erreur s'est produite",
        description: "Une erreur s'est produite lors de l'upload des photos.",
      });
    },
  });

  const onHandleSubmit = (formData: PhotosFormData) => {
    if (!serviceRequest) return;

    const photos = formData.photos
      ?.filter(file => isArrayOfFile(file))
      .flatMap(el => el) as File[]; //Get array of file required to uploadThing

    startTransition(async () => {
      const files = !isEmptyArray(photos) ? await startUpload(photos) : [];
      const formattedPhotos =
        files?.map(file => ({
          key: file?.key,
          name: file.name,
          url: file.url,
        })) ?? [];

      onSubmit({
        ...serviceRequest,
        location: serviceRequest?.location ?? undefined,
        photos: formattedPhotos,
      });
    });
  };

  return (
    <>
      {(isPending || isLoading || isUploading) && (
        <FullSpinner loadingText="Publication de votre demande..." />
      )}
      <Form form={form} onSubmit={onHandleSubmit}>
        <div>
          <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3">
            {fields.map((field, index) => (
              <Controller
                key={field.id}
                control={control}
                name={`photos.${index}`}
                render={({ field: { onChange, value } }) => {
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
            ))}
          </div>
          <HelperMessage className="mt-0.5">
            Le poids maximum d'une image est de 4MB
          </HelperMessage>
        </div>
        <FixedFooterForm>
          <Button
            type="button"
            disabled={isPending}
            onClick={prevStep}
            variant="ghost"
            size="lg"
          >
            Retour
          </Button>
          <Button size="lg" isLoading={isPending}>
            Publier ma demande
          </Button>
        </FixedFooterForm>
      </Form>
    </>
  );
};

export { PhotosForm };
