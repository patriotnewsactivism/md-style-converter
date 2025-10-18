// Image conversion utilities using Canvas API

export interface ImageConversionOptions {
  quality?: number; // 0-1 for JPEG/WebP
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
}

export const convertImage = async (
  file: File,
  targetFormat: string,
  options: ImageConversionOptions = {}
): Promise<Blob> => {
  const {
    quality = 0.92,
    width,
    height,
    maintainAspectRatio = true,
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      let targetWidth = width || img.width;
      let targetHeight = height || img.height;

      // Maintain aspect ratio if requested
      if (maintainAspectRatio && (width || height)) {
        const aspectRatio = img.width / img.height;
        if (width && !height) {
          targetHeight = width / aspectRatio;
        } else if (height && !width) {
          targetWidth = height * aspectRatio;
        }
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Convert to target format
      const mimeType = getMimeType(targetFormat);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert image'));
          }
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

const getMimeType = (format: string): string => {
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'bmp': 'image/bmp',
    'gif': 'image/gif',
  };
  return mimeTypes[format.toLowerCase()] || 'image/png';
};

export const resizeImage = async (
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<Blob> => {
  return convertImage(file, 'png', {
    width: maxWidth,
    height: maxHeight,
    maintainAspectRatio: true,
  });
};

export const compressImage = async (
  file: File,
  quality: number = 0.8
): Promise<Blob> => {
  const format = file.name.split('.').pop()?.toLowerCase() || 'jpeg';
  return convertImage(file, format, { quality });
};