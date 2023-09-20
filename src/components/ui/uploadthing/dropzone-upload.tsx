import { UploadCloud, X } from 'lucide-react';
import { type PropsWithChildren, type ReactElement } from 'react';
import { useDropzone } from 'react-dropzone';
import type { FileWithPath } from 'react-dropzone';
import { generateClientDropzoneAccept } from 'uploadthing/client';

import { cn } from '@/lib/utils';

import { getImageUrl } from '../file-upload';
import { Preview as DefaultPreview } from '../file-upload/preview';
import { Image } from '../image';
import { Spinner } from '../spinner';

type ValidFileTypes = 'image' | 'video' | 'audio' | 'blob' | 'pdf' | 'text';

interface DropzoneUploadProps {
  className?: string;
  dataTestId?: string;
  icon?: ReactElement | JSX.Element;
  label?: string;
  preview?: typeof DefaultPreview | null;
  onChange?: (acceptedFiles: FileWithPath[]) => void;
  onRemove?: (acceptedFile: FileWithPath) => void;
  value: FileWithPath[];
  isLoading?: boolean;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  fileTypes?: ValidFileTypes[];
}

export const DropzoneUpload = ({
  dataTestId,
  icon,
  label = 'Déposez votre image içi !',
  value,
  multiple,
  maxSize,
  isLoading,
  onChange,
  preview: Preview = DefaultPreview,
  fileTypes = ['image'],
  onRemove,
  maxFiles,
  className,
}: PropsWithChildren<DropzoneUploadProps>) => {
  const shouldDisplayImage = value && value?.length === 1;
  const imageUrl = value && getImageUrl(value[0] as File);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => onChange && onChange(acceptedFiles),
    maxSize,
    multiple,
    maxFiles,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  const handleRemove: DropzoneUploadProps['onRemove'] = removedFile => {
    const newFiles = value?.filter(file => file !== removedFile);
    onChange && onChange(newFiles);
    onRemove && onRemove(removedFile);
  };

  if (shouldDisplayImage && imageUrl) {
    return (
      <Image
        src={imageUrl}
        isLoading={isLoading}
        onRemove={() => handleRemove(value[0] as FileWithPath)}
        alt="image-preview"
        className={cn(
          'default__transition group relative flex h-[200px] w-full border border-dashed border-gray-400 transition duration-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-gray-300',
          isLoading &&
            'pointer-events-none cursor-not-allowed hover:bg-inherit',
          className
        )}
      />
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        data-testid={dataTestId}
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
    </div>
  );
};
