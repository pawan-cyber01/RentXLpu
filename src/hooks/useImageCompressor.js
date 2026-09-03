import { useState } from 'react';
import imageCompression from 'browser-image-compression';

export function useImageCompressor() {
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState(null);

  const compressImage = async (file) => {
    setCompressing(true);
    setError(null);

    const options = {
      maxSizeMB: 0.5, // Target ~300-600 KB
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      fileType: 'image/jpeg',
    };

    try {
      const compressedFile = await imageCompression(file, options);
      
      // Convert to base64 for Firestore subcollection storage
      const base64 = await imageCompression.getDataUrlFromFile(compressedFile);
      
      setCompressing(false);
      return {
        file: compressedFile,
        base64,
        sizeKB: Math.round(compressedFile.size / 1024),
      };
    } catch (err) {
      console.error('Image compression failed:', err);
      setError('Failed to compress image. Please try another file.');
      setCompressing(false);
      return null;
    }
  };

  return { compressImage, compressing, error };
}
