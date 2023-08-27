import { X } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

import {
  type FileType,
  getFileIcon,
  getFileName,
  getFileSize,
} from './utils/files';

export interface PreviewProps {
  file: FileType;
  onRemove: (file?: any) => void;
  className?: string;
}

export const Preview: React.FC<PreviewProps> = ({
  file,
  className,
  onRemove,
}) => {
  const Icon = getFileIcon(file);
  const name = getFileName(file);
  const size = getFileSize(file);

  return name ? (
    <div
      data-testid={name}
      className={cn(
        'flex w-fit max-w-sm cursor-pointer items-center gap-1 rounded-full border border-gray-300 bg-white p-1.5 text-sm text-gray-600 shadow transition duration-200 hover:bg-gray-100',
        className
      )}
      onClick={onRemove}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className="truncate">{name}</span>
      {size && (
        <span className="text-secondary-500 whitespace-nowrap">({size})</span>
      )}
      <X className="text-secondary-500 ml-1 h-4 w-4 flex-shrink-0" />
    </div>
  ) : (
    <div />
  );
};
