import { Camera } from 'lucide-react';
import { useRouter } from 'next/router';
import { Controller, useFieldArray } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form, useZodForm } from '@/components/ui/form';
import { DropzoneUpload, useUpload } from '@/components/ui/uploadthing';

import { generateArray } from '@/utils/misc';

import { FixedFooterForm } from '../fixed-footer-form';
import { usePublishServiceRequest } from '../../stores';

type PhotosFormData = {
  photos: File[];
};

type PhotosFormProps = { prevStep: () => void };

const PhotosForm = ({ prevStep }: PhotosFormProps) => {
  const router = useRouter();
  const categorySlugQuery = router?.query?.category as string;

  const { updateServiceRequest, serviceRequest: _serviceRequest } =
    usePublishServiceRequest();

  const serviceRequest = _serviceRequest?.[categorySlugQuery];

  const form = useZodForm({
    mode: 'onChange',
    defaultValues: {
      photos: generateArray(3).map(e => [e]),
    },
  });

  const { control, setValue } = form;
  const { fields } = useFieldArray({ control, name: 'photos' });

  const { startUpload: startUploadPhotoOne, isUploading } = useUpload({
    endpoint: 'imageUploader',
    onSuccess(res) {
      // setValue('photoOne', res);
    },
  });

  const onHandleSubmit = (formData: Partial<PhotosFormData>) => {
    console.log(formData);
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
                console.log(value as never);

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
        <FixedFooterForm>
          <Button type="button" onClick={prevStep} variant="ghost" size="lg">
            Retour
          </Button>
          <Button size="lg">Publier ma demande</Button>
        </FixedFooterForm>
      </Form>
    </>
  );
};

export { PhotosForm };
