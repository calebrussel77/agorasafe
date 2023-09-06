
import { isArray } from './type-guards';

export const getFilePreviewUrl = (file: File) => {
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  const previewUrl = URL.createObjectURL(file);

  return previewUrl;
};

export function serializeFile(fileObject: File | File[] | string) {
  if (typeof fileObject === 'string') return fileObject;

  if (isArray(fileObject)) {
    const filesArray = fileObject?.map(file => ({
      lastModified: file.lastModified,
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    return JSON.stringify(filesArray);
  }

  // reCreate new Object and set File Data into it
  const newFile = {
    lastModified: fileObject.lastModified,
    name: fileObject.name,
    size: fileObject.size,
    type: fileObject.type,
  };

  return JSON.stringify(newFile);
}

