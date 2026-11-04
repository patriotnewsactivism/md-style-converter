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
  const mimeType = getMimeType(targetFormat);
  const {
    quality = 0.92,
    width,
    height,
    maintainAspectRatio = true,
  } = options;

  if ([width, height].some(value => value !== undefined && (!Number.isInteger(value) || value <= 0 || value > 16384))) {
    throw new Error('Image dimensions must be whole numbers between 1 and 16384');
  }

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
        if (width && height) {
          const scale = Math.min(width / img.width, height / img.height);
          targetWidth = Math.max(1, Math.round(img.width * scale));
          targetHeight = Math.max(1, Math.round(img.height * scale));
        } else if (width) {
          targetHeight = width / aspectRatio;
        } else if (height && !width) {
          targetWidth = height * aspectRatio;
        }
      }

      if (targetWidth * targetHeight > 40_000_000) {
        reject(new Error('Requested image is too large'));
        return;
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Convert to target format
      
      canvas.toBlob(
        (blob) => {
          if (blob && blob.type === mimeType) {
            resolve(blob);
          } else {
            reject(new Error('This browser cannot encode the requested image format'));
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
  };
  const mimeType = mimeTypes[format.toLowerCase()];
  if (!mimeType) throw new Error('Image output supports JPG, PNG and WebP only');
  return mimeType;
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
