import { api } from './api';

type UploadResponse = {
  url: string;
  fileName: string;
  mimeType?: string;
};

export function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function uploadImage(file: File) {
  const dataUrl = await fileToDataUrl(file);
  const { data } = await api.post<UploadResponse>('/uploads/images', { dataUrl });
  return data;
}

export async function uploadFile(file: File) {
  const dataUrl = await fileToDataUrl(file);
  const { data } = await api.post<UploadResponse>('/uploads/files', { dataUrl });
  return data;
}
