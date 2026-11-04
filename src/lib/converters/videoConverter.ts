// Browser video support depends on the input codec. Outputs are still images.
export const getVideoMetadata = (file: File): Promise<{
  duration: number; width: number; height: number; size: number;
}> => new Promise((resolve, reject) => {
  const video = document.createElement('video');
  const url = URL.createObjectURL(file);
  const cleanup = () => {
    clearTimeout(timer);
    video.onloadedmetadata = video.onerror = null;
    video.removeAttribute('src');
    video.load();
    URL.revokeObjectURL(url);
  };
  const timer = setTimeout(() => { cleanup(); reject(new Error('Video metadata timed out')); }, 15000);
  video.onloadedmetadata = () => {
    const metadata = { duration: video.duration, width: video.videoWidth, height: video.videoHeight, size: file.size };
    cleanup();
    resolve(metadata);
  };
  video.onerror = () => { cleanup(); reject(new Error('This browser cannot decode the video')); };
  video.preload = 'metadata';
  video.src = url;
});

const renderFrame = (
  file: File, time: number | 'thumbnail', format: string,
  width?: number, height?: number
): Promise<Blob> => new Promise((resolve, reject) => {
  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
  const video = document.createElement('video');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) { reject(new Error('Failed to get canvas context')); return; }
  const url = URL.createObjectURL(file);
  let captured = false;
  let settled = false;
  let targetTime = 0;
  const cleanup = () => {
    clearTimeout(timer);
    video.onloadedmetadata = video.onloadeddata = video.onseeked = video.onerror = null;
    video.removeAttribute('src');
    video.load();
    URL.revokeObjectURL(url);
  };
  const fail = (error: Error) => {
    if (settled) return;
    settled = true;
    cleanup();
    reject(error);
  };
  const timer = setTimeout(() => fail(new Error('Video frame extraction timed out')), 15000);
  const draw = () => {
    if (settled || captured || video.seeking || video.readyState < 2 || Math.abs(video.currentTime - targetTime) > 0.05) return;
    captured = true;
    try {
      canvas.width = width ?? video.videoWidth;
      canvas.height = height ?? video.videoHeight;
      const scale = Math.min(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
      const drawWidth = video.videoWidth * scale;
      const drawHeight = video.videoHeight * scale;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, (canvas.width - drawWidth) / 2, (canvas.height - drawHeight) / 2, drawWidth, drawHeight);
      canvas.toBlob(blob => {
        if (settled) return;
        if (!blob || blob.type !== mimeType) { fail(new Error('Failed to encode the requested image format')); return; }
        settled = true;
        cleanup();
        resolve(blob);
      }, mimeType, 0.95);
    } catch (error) { fail(error instanceof Error ? error : new Error('Failed to extract frame')); }
  };
  video.onloadedmetadata = () => {
    targetTime = time === 'thumbnail' ? Math.min(1, video.duration * 0.1) : time;
    if (!Number.isFinite(targetTime) || targetTime < 0 || targetTime >= video.duration) {
      fail(new Error('Frame time is outside the video duration'));
      return;
    }
    // At time zero no seek event is guaranteed; loadeddata supplies the first frame.
    if (targetTime !== video.currentTime) video.currentTime = targetTime;
    draw();
  };
  video.onloadeddata = draw;
  video.onseeked = draw;
  video.onerror = () => fail(new Error('This browser cannot decode the video'));
  video.preload = 'auto';
  video.muted = true;
  video.src = url;
});

export const extractVideoFrame = (file: File, timeInSeconds = 0, format = 'jpg'): Promise<Blob> =>
  renderFrame(file, timeInSeconds, format);

export const createVideoThumbnail = (file: File, width = 320, height = 180): Promise<Blob> =>
  renderFrame(file, 'thumbnail', 'jpg', width, height);

export const resizeVideo = (file: File, width: number, height: number): Promise<Blob> =>
  renderFrame(file, 0, 'jpg', width, height);

export const getVideoInfo = async (file: File): Promise<string> => {
  const metadata = await getVideoMetadata(file);
  return `Duration: ${metadata.duration.toFixed(2)} seconds\nResolution: ${metadata.width}x${metadata.height}\nFile size: ${metadata.size} bytes`;
};
