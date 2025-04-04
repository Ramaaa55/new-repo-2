import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { processFile } from '../utils/fileProcessing';

interface FileUploadProps {
  onTextExtracted: (text: string) => void;
  onError: (error: string) => void;
}

export function FileUpload({ onTextExtracted, onError }: FileUploadProps) {
  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        try {
          const result = await processFile(file);
          if (result.error) {
            onError(result.error);
          } else {
            onTextExtracted(result.text);
          }
        } catch (error) {
          onError('Error processing file');
        }
      }
    },
    [onTextExtracted, onError]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          const result = await processFile(file);
          if (result.error) {
            onError(result.error);
          } else {
            onTextExtracted(result.text);
          }
        } catch (error) {
          onError('Error processing file');
        }
      }
    },
    [onTextExtracted, onError]
  );

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        Drag and drop your file here, or{' '}
        <label className="text-blue-500 hover:text-blue-600 cursor-pointer">
          browse
          <input
            type="file"
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.txt"
            onChange={handleFileInput}
          />
        </label>
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Supports PDF, images (PNG, JPG), and text files
      </p>
    </div>
  );
}