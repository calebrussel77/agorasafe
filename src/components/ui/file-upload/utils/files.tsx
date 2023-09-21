import { Camera, FileVideo, Link2, Music2 } from 'lucide-react';

import { ExcelIcon } from '@/components/icons/excel-icon';
import { PdfIcon } from '@/components/icons/pdf-icon';
import { PowerpointIcon } from '@/components/icons/powerpoint-icon';
import { WordIcon } from '@/components/icons/word-icon';
import { ZipIcon } from '@/components/icons/zip-icon';

import { getFilePreviewUrl } from '@/utils/files';

import { formatBytes } from './formatBytes';
import { types } from './types';

export type FileType = string | File;
export type ForceFileType = 'image' | 'audio' | 'video';

function removeQueryString(name: string): string {
  return name.split('?')[0] || '';
}

export function getFileName(file: FileType): string {
  if (typeof file === 'string') {
    return removeQueryString(file).split('/').pop() || '';
  } else {
    return file.name;
  }
}

export function getMimeType(file: FileType) {
  if (!file) return null;
  if (typeof file === 'string') {
    const fileName = getFileName(file).split('.').pop();
    return fileName ? types[fileName] : null;
  } else {
    return file?.type;
  }
}

export function getFileSize(file: FileType) {
  return file instanceof File && file.size ? formatBytes(file.size, 0) : null;
}

export function getFileIcon(file: FileType, forceFileType?: ForceFileType) {
  const mimeType = getMimeType(file);

  if (!forceFileType && !mimeType) {
    return Link2;
  }

  if (
    forceFileType === 'image' ||
    (mimeType && mimeType.startsWith('image/'))
  ) {
    return Camera;
  }
  if (
    forceFileType === 'audio' ||
    (mimeType && mimeType.startsWith('audio/'))
  ) {
    return Music2;
  }
  if (
    forceFileType === 'video' ||
    (mimeType && mimeType.startsWith('video/'))
  ) {
    return FileVideo;
  }

  switch (mimeType) {
    case 'application/pdf':
      return PdfIcon;
    case 'application/msword':
      return WordIcon;
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return WordIcon;
    case 'application/vnd.ms-excel':
      return ExcelIcon;
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return ExcelIcon;
    case 'application/vnd.ms-powerpoint':
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      return PowerpointIcon;
    case 'application/zip':
    case 'application/x-bzip':
    case 'application/x-bzip2':
    case 'application/x-7z-compressed':
    case 'application/gzip':
    case 'application/vnd.rar':
      return ZipIcon;
    case 'text/csv':
      return ExcelIcon;
    default:
      return Link2;
  }
}

export const checkIsImageFile = (file: string | File) => {
  const mimeType = getMimeType(file);
  const isImage = mimeType && mimeType.startsWith('image/');
  return isImage;
};

export const getImageUrl = (file: string | File) => {
  const isImage = checkIsImageFile(file);

  if (isImage && file instanceof File) {
    return getFilePreviewUrl(file);
  }
  if (isImage && typeof file === 'string') {
    return file;
  }
  return null;
};
