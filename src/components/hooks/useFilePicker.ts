import { useState } from 'react';

interface FileItem {
  id: string;
  name: string;
  ext: string;
  size: number; // KB
  error?: string;
}

export const useFilePicker = ({
  acceptExt,
  maxSizeMB,
  maxCount,
  onError,
}: {
  acceptExt: string[];
  maxSizeMB: number;
  maxCount: number;
  onError?: (message: string) => void;
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);

  const handleDrop = (droppedFiles: File[]) => {
    const remaining = maxCount - files.length;

    // ✅ 초과 시도 즉시 감지
    if (remaining <= 0) {
      onError?.(`최대 ${maxCount}개까지 업로드할 수 있습니다.`);
      return;
    }

    if (droppedFiles.length > remaining) {
      onError?.(`최대 ${maxCount}개까지 업로드할 수 있습니다.`);
    }

    const filesToAdd = droppedFiles.slice(0, remaining);

    setFiles(prev => {
      const existingKeys = new Set(prev.map(f => `${f.name}.${f.ext}-${f.size}`));
      const next: FileItem[] = [];

      for (const file of filesToAdd) {
        const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
        const sizeKB = Math.round(file.size / 1024);
        const name = file.name.replace(/\.[^/.]+$/, '');
        const key = `${name}.${ext}-${sizeKB}`;

        let error: string | undefined;

        if (existingKeys.has(key)) {
          error = '이미 추가된 파일입니다.';
        } else if (!acceptExt.includes(ext)) {
          error = '허용되지 않은 파일 형식입니다.';
        } else if (file.size > maxSizeMB * 1024 * 1024) {
          error = `${maxSizeMB}MB 이하만 업로드 가능합니다.`;
        }

        next.push({
          id: crypto.randomUUID(),
          name,
          ext,
          size: sizeKB,
          error,
        });

        existingKeys.add(key);
      }

      return [...prev, ...next];
    });
  };

  const handleRemove = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleClear = () => {
    setFiles([]);
  };

  return { files, handleDrop, handleRemove, handleClear };
};
