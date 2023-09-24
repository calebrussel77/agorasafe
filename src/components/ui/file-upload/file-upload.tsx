/* eslint-disable @typescript-eslint/no-unsafe-return */

/* eslint-disable no-unused-vars */
import { UploadCloud } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import React, {
  type PropsWithChildren,
  type ReactElement,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';

import { cn } from '@/lib/utils';

import { useMergeRefs } from '@/hooks/use-merge-refs';

import { createEvent } from './create-event';
// FileUpload
import { Preview as DefaultPreview } from './preview';

const DEFAULT_MAX_FILE_SIZE = 200 * 10 * 1000;
const DEFAULT_FILE_TYPES = 'image/*';

export interface FileWithPreview extends File {
  preview?: string;
}

export type FileWithPreviewType = FileWithPreview;

type HandleRemoveType = (file: FileWithPreviewType) => void;

type FileChildrenProps = {
  openFile: () => void;
  disabled: boolean | undefined;
  files: FileWithPreviewType[];
  onRemoveFile: HandleRemoveType;
};

export interface FileUploadOptions {
  /** Pass a comma-separated string of file types e.g. "image/png" or "image/png,image/jpeg" */
  accept?: string;
  dataTestId?: string;
  icon?: ReactElement | JSX.Element;
  maxSize?: number;
  handleAddFile?: (
    files: FileWithPreviewType[] | FileWithPreviewType
  ) => void;
  handleRemoveFile?: HandleRemoveType;
  preview?: typeof DefaultPreview | null;
  onBlur?: () => void;
  onChange?: (event: ReturnType<typeof createEvent>) => void;
  children?: (props: FileChildrenProps) => React.ReactNode;
}

export type FileUploadProps = Omit<
  React.HTMLProps<HTMLInputElement>,
  'children'
> &
  FileUploadOptions;

const ensureArray: (
  value: unknown[] | unknown
) => FileWithPreviewType[] = value => {
  if (Array.isArray(value)) {
    return value;
  } else if (value) {
    return [value];
  }
  return [];
};

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      accept = DEFAULT_FILE_TYPES,
      children,
      dataTestId,
      disabled,
      maxSize = DEFAULT_MAX_FILE_SIZE,
      multiple,
      name,
      label = 'Uplaod a file',
      icon,
      handleAddFile,
      onBlur,
      onChange,
      handleRemoveFile,
      value = [],
      preview: Preview = DefaultPreview,
      ...rest
    },
    ref
  ) => {
    // We always keep an array of files
    const [files, setFiles] = useState<FileWithPreviewType[]>(
      ensureArray(value)
    );
    const inputRef = useRef<HTMLInputElement>();

    const refs = useMergeRefs(inputRef, ref);

    // Ensure component is controlled
    useEffect(() => {
      if (value) {
        setFiles(ensureArray(value));
      }
    }, [value]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
      let newFiles: FileWithPreview[] | FileWithPreview = Array.from(
        e.target.files as never
        //@ts-expect-error unexpected ts error fot this type
      ).map((file: FileWithPreview) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        file.preview = URL.createObjectURL(file);
        return file;
      });
      setFiles(newFiles);

      if (newFiles.length === 1) {
        newFiles = newFiles[0] as never;
      }

      const event = createEvent({ name, value: newFiles });
      handleAddFile && handleAddFile(newFiles);
      onChange && onChange(event);
      // onBlur && onBlur();
    };

    const handleRemove: FileUploadProps['handleRemoveFile'] = removedFile => {
      const newFiles = files.filter(file => file !== removedFile);
      const value = multiple ? newFiles : undefined;
      setFiles(newFiles);

      const event = createEvent({ name, value });
      onChange && onChange(event);
      handleRemoveFile && handleRemoveFile(removedFile);
      // onBlur && onBlur();
    };

    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.click();
      }
    };

    // We need to add this key on the input[file] because we can't change it's value programmatically for security reasons
    // Changing its key means that we can add a file, remove it & re-add it
    const inputKey = files
      .map(file => (file instanceof File ? file.preview : undefined))
      .join('');

    return (
      <>
        {children ? (
          children({
            openFile: handleClick,
            disabled,
            files,
            onRemoveFile: handleRemove,
          })
        ) : (
          <FileUploadButton disabled={disabled} openFile={handleClick}>
            {icon ? icon : <UploadCloud className="h-6 w-6" />}
            {label}
          </FileUploadButton>
        )}
        <input
          accept={accept}
          className="sr-only"
          data-testid={dataTestId}
          disabled={disabled}
          key={inputKey}
          max={maxSize}
          multiple={multiple}
          name={name}
          onBlur={onBlur}
          ref={refs}
          {...rest}
          onChange={handleChange}
          type="file"
        />
        {Preview && (
          <div className="mt-2.5">
            {files.map(file => (
              <Preview
                file={file}
                key={file instanceof File ? file.name : file}
                onRemove={() => handleRemove(file)}
              />
            ))}
          </div>
        )}
      </>
    );
  }
);
FileUpload.displayName = 'FileUpload';

export const FileUploadButton = ({
  openFile: handleClick,
  disabled,
  files,
  onRemoveFile: handleRemove,
  children,
  className,
}: PropsWithChildren<Partial<FileChildrenProps> & { className?: string }>) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'default__transition group relative flex h-[200px] w-full flex-col items-center justify-center gap-3 border border-dashed border-gray-400 bg-gray-50 p-2 transition duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-300',
        className
      )}
    >
      <div
        title="Changer"
        className="default__transition absolute inset-0 z-20 bg-gray-900/60 opacity-0 group-hover:opacity-100"
      />
      {children}
    </button>
  );
};
