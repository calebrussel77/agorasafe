import { Camera } from 'lucide-react';
import { useRouter } from 'next/router';
import { Controller, useFieldArray } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, useZodForm } from '@/components/ui/form';
import { DropzoneUpload, useUpload } from '@/components/ui/uploadthing';

import { generateArray } from '@/utils/misc';
import { isArrayOfFile } from '@/utils/type-guards';

import {
  type PublishServiceRequestFormStore,
  usePublishServiceRequest,
} from '../../stores';
import { FixedFooterForm } from '../fixed-footer-form';

const photosFormSchema = z.object({
  photos: z.array(z.unknown()).optional().nullable().default(null),
});

type PhotosFormData = z.infer<typeof photosFormSchema>;
type PhotosFormProps = {
  prevStep: () => void;
  onSubmit: (formData: PublishServiceRequestFormStore) => void;
  isLoading?: boolean;
};

const PhotosForm = ({ prevStep, onSubmit, isLoading }: PhotosFormProps) => {
  const router = useRouter();
  const categorySlugQuery = router?.query?.category as string;

  const { serviceRequest: _serviceRequest } = usePublishServiceRequest();

  const serviceRequest = _serviceRequest?.[categorySlugQuery];

  const form = useZodForm({
    schema: photosFormSchema,
    defaultValues: {
      photos: generateArray(3).map(e => [e]),
    },
  });

  const {
    control,
    formState: { errors },
  } = form;
  const { fields } = useFieldArray({ control, name: 'photos' });

  // useTra
  const { startUpload: startUploadPhotoOne, isUploading } = useUpload({
    endpoint: 'imageUploader',
    onSuccess(res) {
      // setValue('photoOne', res);
    },
  });

  console.log({ errors });

  const onHandleSubmit = (formData: PhotosFormData) => {
    console.log(
      formData.photos?.filter(file => isArrayOfFile(file)).flatMap(el => el) //Get array of file required to uploadThing
    );

    if (!serviceRequest) return;
    // onSubmit(serviceRequest as PublishServiceRequestFormStore);
  };

  return (
    <>
      {/* {error && <SectionMessage title={error.message} appareance="danger" />} */}
      <Form form={form} onSubmit={onHandleSubmit}>
        <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3">
          {fields.map((field, index) => (
            <Controller
              key={field.id}
              control={control}
              name={`photos.${index}`}
              render={({ field: { onChange, value } }) => {
                const fileValue = value as File[];

                // console.log({ fileValue });

                return (
                  <DropzoneUpload
                    // isLoading={true}
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
        <FixedFooterForm>
          <Button type="button" onClick={prevStep} variant="ghost" size="lg">
            Retour
          </Button>
          <Button size="lg" isLoading={isLoading}>
            Publier ma demande
          </Button>
        </FixedFooterForm>
      </Form>
    </>
  );
};

export { PhotosForm };
