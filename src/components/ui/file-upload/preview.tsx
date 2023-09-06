import { X } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

import { Avatar } from '../avatar';
import {
  type FileType,
  getFileIcon,
  getFileName,
  getFileSize,
  getImageUrl,
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
  const imageUrl = getImageUrl(file);

  return name ? (
    <div
      data-testid={name}
      title="Cliquer pour supprimer"
      className={cn(
        'flex w-full max-w-sm cursor-pointer items-center gap-1 overflow-hidden rounded-full border border-gray-300 bg-white p-1.5 text-sm text-gray-600 shadow transition duration-200 hover:bg-gray-100',
        className
      )}
      onClick={onRemove}
    >
      {imageUrl ? (
        <Avatar src={imageUrl} alt={name} className="h-5 w-5 flex-shrink-0" />
      ) : (
        <Icon className="h-5 w-5 flex-shrink-0" />
      )}
      <span className="line-clamp-1 text-gray-600">{name}</span>
      {size && (
        <span className="whitespace-nowrap text-brand-500">({size})</span>
      )}
      <X className="text-secondary-500 ml-1 h-4 w-4 flex-shrink-0" />
    </div>
  ) : (
    <div />
  );
};
