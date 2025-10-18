// Video conversion utilities
// Note: Browser-based video conversion is very limited
// For production use, consider server-side processing with FFmpeg

export interface VideoConversionOptions {
  width?: number;
  height?: number;
  quality?: number;
  fps?: number;
}

export const getVideoMetadata = async (file: File): Promise<{
  duration: number;
  width: number;
  height: number;
  size: number;
}> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);

    video.addEventListener('loadedmetadata', () => {
      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        size: file.size,
      });
      URL.revokeObjectURL(url);
    });

    video.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load video file'));
    });

    video.src = url;
  });
};

export const extractVideoFrame = async (
  file: File,
  timeInSeconds: number = 0
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const url = URL.createObjectURL(file);

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      video.currentTime = timeInSeconds;
    });

    video.addEventListener('seeked', () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to extract frame'));
        }
        URL.revokeObjectURL(url);
      }, 'image/jpeg', 0.95);
    });

    video.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load video'));
    });

    video.src = url;
  });
};

export const resizeVideo = async (
  file: File,
  targetWidth: number,
  targetHeight: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const url = URL.createObjectURL(file);

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    video.addEventListener('loadedmetadata', () => {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      // For now, we can only extract a frame
      // Full video conversion requires MediaRecorder API or server-side processing
      video.currentTime = 0;
    });

    video.addEventListener('seeked', () => {
      ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to resize video'));
        }
        URL.revokeObjectURL(url);
      }, 'image/jpeg', 0.95);
    });

    video.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load video'));
    });

    video.src = url;
  });
};

export const convertVideoToGif = async (
  file: File,
  options: {
    startTime?: number;
    duration?: number;
    fps?: number;
    width?: number;
    height?: number;
  } = {}
): Promise<string> => {
  // This is a placeholder - actual GIF conversion requires libraries like gif.js
  // For production, use server-side conversion or a library like FFmpeg.wasm
  return new Promise((resolve, reject) => {
    reject(new Error('GIF conversion requires additional libraries. Please use a server-side solution.'));
  });
};

// Note: For actual video format conversion (MP4, WebM, etc.),
// you would need to use:
// 1. Server-side processing with FFmpeg
// 2. FFmpeg.wasm (WebAssembly version)
// 3. Cloud services like Cloudinary or AWS MediaConvert

export const getVideoInfo = async (file: File): Promise<string> => {
  const metadata = await getVideoMetadata(file);
  return `
Video Information:
- Duration: ${metadata.duration.toFixed(2)} seconds
- Resolution: ${metadata.width}x${metadata.height}
- File Size: ${(metadata.size / (1024 * 1024)).toFixed(2)} MB
- Format: ${file.type}
  `.trim();
};

export const createVideoThumbnail = async (
  file: File,
  width: number = 320,
  height: number = 180
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const url = URL.createObjectURL(file);

    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    video.addEventListener('loadedmetadata', () => {
      // Calculate aspect ratio
      const aspectRatio = video.videoWidth / video.videoHeight;
      const targetAspectRatio = width / height;

      let drawWidth = width;
      let drawHeight = height;

      if (aspectRatio > targetAspectRatio) {
        drawHeight = width / aspectRatio;
      } else {
        drawWidth = height * aspectRatio;
      }

      canvas.width = width;
      canvas.height = height;

      // Center the video
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;

      video.currentTime = Math.min(1, video.duration * 0.1); // 10% into video
    });

    video.addEventListener('seeked', () => {
      const aspectRatio = video.videoWidth / video.videoHeight;
      const targetAspectRatio = width / height;

      let drawWidth = width;
      let drawHeight = height;

      if (aspectRatio > targetAspectRatio) {
        drawHeight = width / aspectRatio;
      } else {
        drawWidth = height * aspectRatio;
      }

      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(video, x, y, drawWidth, drawHeight);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create thumbnail'));
        }
        URL.revokeObjectURL(url);
      }, 'image/jpeg', 0.85);
    });

    video.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load video'));
    });

    video.src = url;
  });
};