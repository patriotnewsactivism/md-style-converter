// File type definitions and detection utilities

export enum FileCategory {
  DOCUMENT = 'document',
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
}

export interface FileTypeInfo {
  category: FileCategory;
  extension: string;
  mimeType: string;
  displayName: string;
}

export const SUPPORTED_FILE_TYPES: Record<string, FileTypeInfo> = {
  // Documents
  'md': { category: FileCategory.DOCUMENT, extension: 'md', mimeType: 'text/markdown', displayName: 'Markdown' },
  'pdf': { category: FileCategory.DOCUMENT, extension: 'pdf', mimeType: 'application/pdf', displayName: 'PDF' },
  'docx': { category: FileCategory.DOCUMENT, extension: 'docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', displayName: 'Word Document' },
  'txt': { category: FileCategory.DOCUMENT, extension: 'txt', mimeType: 'text/plain', displayName: 'Text File' },
  'html': { category: FileCategory.DOCUMENT, extension: 'html', mimeType: 'text/html', displayName: 'HTML' },
  'rtf': { category: FileCategory.DOCUMENT, extension: 'rtf', mimeType: 'application/rtf', displayName: 'Rich Text Format' },
  
  // Images
  'jpg': { category: FileCategory.IMAGE, extension: 'jpg', mimeType: 'image/jpeg', displayName: 'JPEG' },
  'jpeg': { category: FileCategory.IMAGE, extension: 'jpeg', mimeType: 'image/jpeg', displayName: 'JPEG' },
  'png': { category: FileCategory.IMAGE, extension: 'png', mimeType: 'image/png', displayName: 'PNG' },
  'gif': { category: FileCategory.IMAGE, extension: 'gif', mimeType: 'image/gif', displayName: 'GIF' },
  'webp': { category: FileCategory.IMAGE, extension: 'webp', mimeType: 'image/webp', displayName: 'WebP' },
  'bmp': { category: FileCategory.IMAGE, extension: 'bmp', mimeType: 'image/bmp', displayName: 'BMP' },
  'svg': { category: FileCategory.IMAGE, extension: 'svg', mimeType: 'image/svg+xml', displayName: 'SVG' },
  'ico': { category: FileCategory.IMAGE, extension: 'ico', mimeType: 'image/x-icon', displayName: 'Icon' },
  
  // Audio
  'mp3': { category: FileCategory.AUDIO, extension: 'mp3', mimeType: 'audio/mpeg', displayName: 'MP3' },
  'wav': { category: FileCategory.AUDIO, extension: 'wav', mimeType: 'audio/wav', displayName: 'WAV' },
  'ogg': { category: FileCategory.AUDIO, extension: 'ogg', mimeType: 'audio/ogg', displayName: 'OGG' },
  'flac': { category: FileCategory.AUDIO, extension: 'flac', mimeType: 'audio/flac', displayName: 'FLAC' },
  'aac': { category: FileCategory.AUDIO, extension: 'aac', mimeType: 'audio/aac', displayName: 'AAC' },
  'm4a': { category: FileCategory.AUDIO, extension: 'm4a', mimeType: 'audio/mp4', displayName: 'M4A' },
  
  // Video
  'mp4': { category: FileCategory.VIDEO, extension: 'mp4', mimeType: 'video/mp4', displayName: 'MP4' },
  'webm': { category: FileCategory.VIDEO, extension: 'webm', mimeType: 'video/webm', displayName: 'WebM' },
  'avi': { category: FileCategory.VIDEO, extension: 'avi', mimeType: 'video/x-msvideo', displayName: 'AVI' },
  'mov': { category: FileCategory.VIDEO, extension: 'mov', mimeType: 'video/quicktime', displayName: 'MOV' },
  'mkv': { category: FileCategory.VIDEO, extension: 'mkv', mimeType: 'video/x-matroska', displayName: 'MKV' },
  'ogv': { category: FileCategory.VIDEO, extension: 'ogv', mimeType: 'video/ogg', displayName: 'OGV' },
};

export const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

export const getFileTypeInfo = (filename: string): FileTypeInfo | null => {
  const extension = getFileExtension(filename);
  return SUPPORTED_FILE_TYPES[extension] || null;
};

export const getFileCategory = (filename: string): FileCategory | null => {
  const info = getFileTypeInfo(filename);
  return info ? info.category : null;
};

export const getConversionOptions = (category: FileCategory): FileTypeInfo[] => {
  return Object.values(SUPPORTED_FILE_TYPES).filter(
    (type) => type.category === category
  );
};

export const isFileTypeSupported = (filename: string): boolean => {
  const extension = getFileExtension(filename);
  return extension in SUPPORTED_FILE_TYPES;
};

export const getSupportedExtensions = (category?: FileCategory): string[] => {
  if (category) {
    return Object.values(SUPPORTED_FILE_TYPES)
      .filter((type) => type.category === category)
      .map((type) => `.${type.extension}`);
  }
  return Object.keys(SUPPORTED_FILE_TYPES).map((ext) => `.${ext}`);
};

export const getAcceptString = (category?: FileCategory): string => {
  return getSupportedExtensions(category).join(',');
};