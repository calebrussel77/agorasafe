import { UploadCloud, X } from 'lucide-react';
import { type PropsWithChildren, type ReactElement } from 'react';
import { useDropzone } from 'react-dropzone';
import type { FileWithPath } from 'react-dropzone';
import { generateClientDropzoneAccept } from 'uploadthing/client';

import { cn } from '@/lib/utils';

import { checkIsImageFile } from '../file-upload';
import { Preview as DefaultPreview } from '../file-upload/preview';
import { HelperMessage } from '../helper-message';
import { Image } from '../image';
import { Spinner } from '../spinner';
import { VariantMessage } from '../variant-message';

type ValidFileTypes = 'image' | 'video' | 'audio' | 'blob' | 'pdf' | 'text';

export interface FileWithPreview extends File {
  preview?: string;
}

interface DropzoneUploadProps {
  className?: string;
  dataTestId?: string;
  icon?: ReactElement | JSX.Element;
  label?: string;
  preview?: typeof DefaultPreview | null;
  onChange?: (acceptedFiles: FileWithPreview[]) => void;
  onRemove?: (acceptedFile: FileWithPreview) => void;
  value: FileWithPreview[];
  isLoading?: boolean;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  fileTypes?: ValidFileTypes[];
  error?: string;
  hint?: string;
}

export const DropzoneUpload = ({
  dataTestId,
  icon,
  label = 'Déposez votre image içi !',
  value,
  multiple,
  maxSize,
  error,
  hint,
  isLoading,
  onChange,
  preview: Preview = DefaultPreview,
  fileTypes = ['image'],
  onRemove,
  maxFiles,
  className,
}: PropsWithChildren<DropzoneUploadProps>) => {
  const isSingleFile = value && value?.length === 1;
  const imageUrl = value && value[0]?.preview;
  const isImageCanBeDisplay =
    isSingleFile && checkIsImageFile(value[0] as File) && imageUrl;

  const handleChange = (acceptedFiles: FileWithPath[]) => {
    const newFiles: FileWithPreview[] = Array.from(acceptedFiles).map(
      (file: FileWithPreview) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        file.preview = URL.createObjectURL(file);
        return file;
      }
    );

    onChange && onChange(newFiles);
    // onBlur && onBlur();
  };

  const handleRemove: DropzoneUploadProps['onRemove'] = removedFile => {
    const newFiles = value?.filter(file => file !== removedFile);
    onChange && onChange(newFiles);
    onRemove && onRemove(removedFile);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => handleChange(acceptedFiles),
    maxSize,
    multiple,
    maxFiles,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  if (isImageCanBeDisplay) {
    return (
      <>
        <Image
          src={imageUrl}
          style={!!error ? { borderColor: 'red' } : {}}
          isLoading={isLoading}
          onRemove={() => handleRemove(value[0] as FileWithPreview)}
          alt="image-preview"
          className={cn(
            'default__transition group relative flex h-[200px] w-full border border-dashed border-gray-400 transition duration-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-gray-300',
            isLoading &&
              'pointer-events-none cursor-not-allowed hover:bg-inherit',
            className
          )}
        />
        {hint && <HelperMessage className="mt-0.5">{hint}</HelperMessage>}
      </>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        data-testid={dataTestId}
        title="Cliquez pour sélectionner"
        style={!!error ? { borderColor: 'red' } : {}}
        className={cn(
          'default__transition group relative flex h-[200px] w-full flex-col items-center justify-center gap-3 border border-dashed border-gray-400 bg-gray-50 p-2 text-center transition duration-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-gray-300',
          isLoading &&
            'pointer-events-none cursor-not-allowed hover:bg-inherit',
          className
        )}
      >
        {isLoading && (
          <div className="default__transition absolute inset-0 z-10 flex items-center justify-center bg-gray-900/50">
            <Spinner className="z-30" />
          </div>
        )}
        {icon ? icon : <UploadCloud className="h-6 w-6" />}
        {label}
        <input {...getInputProps()} />
      </div>
      {error && (
        <VariantMessage className="mt-2" variant="danger">
          {error}
        </VariantMessage>
      )}
      {Preview && value && (
        <div className="mt-2.5">
          {value?.map(file => (
            <Preview
              file={file}
              key={file instanceof File ? file.name : file}
              onRemove={() => handleRemove(file)}
            />
          ))}
        </div>
      )}
      {hint && <HelperMessage className="mt-0.5">{hint}</HelperMessage>}
    </div>
  );
};
