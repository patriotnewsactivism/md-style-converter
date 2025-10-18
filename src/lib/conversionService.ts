// Main conversion service that orchestrates all conversions
import { FileCategory, getFileTypeInfo, getFileExtension } from './fileTypes';
import { convertImage, ImageConversionOptions } from './converters/imageConverter';
import { 
  markdownToHtml, 
  convertMarkdownToDOCX, 
  convertHtmlToPDF,
  convertTextToHtml,
  readFileAsText 
} from './converters/documentConverter';
import { convertAudioFormat, getAudioMetadata } from './converters/audioConverter';
import { getVideoMetadata, extractVideoFrame, createVideoThumbnail } from './converters/videoConverter';
import { saveAs } from 'file-saver';

export interface ConversionResult {
  success: boolean;
  message: string;
  blob?: Blob;
  filename?: string;
}

export class ConversionService {
  static async convert(
    file: File,
    targetFormat: string,
    options: any = {}
  ): Promise<ConversionResult> {
    const sourceInfo = getFileTypeInfo(file.name);
    
    if (!sourceInfo) {
      return {
        success: false,
        message: 'Unsupported source file format',
      };
    }

    try {
      switch (sourceInfo.category) {
        case FileCategory.IMAGE:
          return await this.convertImage(file, targetFormat, options);
        
        case FileCategory.DOCUMENT:
          return await this.convertDocument(file, targetFormat, options);
        
        case FileCategory.AUDIO:
          return await this.convertAudio(file, targetFormat, options);
        
        case FileCategory.VIDEO:
          return await this.convertVideo(file, targetFormat, options);
        
        default:
          return {
            success: false,
            message: 'Unsupported file category',
          };
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Conversion failed',
      };
    }
  }

  private static async convertImage(
    file: File,
    targetFormat: string,
    options: ImageConversionOptions
  ): Promise<ConversionResult> {
    const blob = await convertImage(file, targetFormat, options);
    const filename = file.name.replace(/\.[^.]+$/, `.${targetFormat}`);
    
    return {
      success: true,
      message: 'Image converted successfully',
      blob,
      filename,
    };
  }

  private static async convertDocument(
    file: File,
    targetFormat: string,
    options: any
  ): Promise<ConversionResult> {
    const sourceExt = getFileExtension(file.name);
    const content = await readFileAsText(file);
    const baseFilename = file.name.replace(/\.[^.]+$/, '');

    // Markdown conversions
    if (sourceExt === 'md') {
      if (targetFormat === 'html') {
        const html = markdownToHtml(content);
        const blob = new Blob([html], { type: 'text/html' });
        return {
          success: true,
          message: 'Converted to HTML',
          blob,
          filename: `${baseFilename}.html`,
        };
      } else if (targetFormat === 'pdf') {
        const html = markdownToHtml(content);
        await convertHtmlToPDF(html, `${baseFilename}.pdf`);
        return {
          success: true,
          message: 'Converted to PDF',
        };
      } else if (targetFormat === 'docx') {
        await convertMarkdownToDOCX(content, `${baseFilename}.docx`);
        return {
          success: true,
          message: 'Converted to DOCX',
        };
      } else if (targetFormat === 'txt') {
        const blob = new Blob([content], { type: 'text/plain' });
        return {
          success: true,
          message: 'Converted to TXT',
          blob,
          filename: `${baseFilename}.txt`,
        };
      }
    }

    // Text file conversions
    if (sourceExt === 'txt') {
      if (targetFormat === 'html') {
        const html = convertTextToHtml(content);
        const blob = new Blob([html], { type: 'text/html' });
        return {
          success: true,
          message: 'Converted to HTML',
          blob,
          filename: `${baseFilename}.html`,
        };
      } else if (targetFormat === 'pdf') {
        const html = convertTextToHtml(content);
        await convertHtmlToPDF(html, `${baseFilename}.pdf`);
        return {
          success: true,
          message: 'Converted to PDF',
        };
      } else if (targetFormat === 'md') {
        const blob = new Blob([content], { type: 'text/markdown' });
        return {
          success: true,
          message: 'Converted to Markdown',
          blob,
          filename: `${baseFilename}.md`,
        };
      }
    }

    // HTML conversions
    if (sourceExt === 'html') {
      if (targetFormat === 'pdf') {
        await convertHtmlToPDF(content, `${baseFilename}.pdf`);
        return {
          success: true,
          message: 'Converted to PDF',
        };
      } else if (targetFormat === 'txt') {
        const temp = document.createElement('div');
        temp.innerHTML = content;
        const text = temp.textContent || temp.innerText || '';
        const blob = new Blob([text], { type: 'text/plain' });
        return {
          success: true,
          message: 'Converted to TXT',
          blob,
          filename: `${baseFilename}.txt`,
        };
      }
    }

    return {
      success: false,
      message: `Conversion from ${sourceExt} to ${targetFormat} is not yet supported`,
    };
  }

  private static async convertAudio(
    file: File,
    targetFormat: string,
    options: any
  ): Promise<ConversionResult> {
    // Get metadata first
    const metadata = await getAudioMetadata(file);
    
    // For now, we can only convert to WAV reliably in the browser
    if (targetFormat === 'wav') {
      const blob = await convertAudioFormat(file, targetFormat, options);
      const filename = file.name.replace(/\.[^.]+$/, `.${targetFormat}`);
      
      return {
        success: true,
        message: `Audio converted successfully (${metadata.duration.toFixed(1)}s, ${metadata.sampleRate}Hz)`,
        blob,
        filename,
      };
    }

    return {
      success: false,
      message: 'Browser-based audio conversion is limited to WAV format. For other formats, please use a server-side solution.',
    };
  }

  private static async convertVideo(
    file: File,
    targetFormat: string,
    options: any
  ): Promise<ConversionResult> {
    const metadata = await getVideoMetadata(file);
    const baseFilename = file.name.replace(/\.[^.]+$/, '');

    // For video, we can extract frames or create thumbnails
    if (targetFormat === 'jpg' || targetFormat === 'jpeg' || targetFormat === 'png') {
      const blob = await extractVideoFrame(file, options.timeInSeconds || 0);
      return {
        success: true,
        message: 'Extracted video frame',
        blob,
        filename: `${baseFilename}_frame.${targetFormat}`,
      };
    } else if (targetFormat === 'thumbnail') {
      const blob = await createVideoThumbnail(file);
      return {
        success: true,
        message: 'Created video thumbnail',
        blob,
        filename: `${baseFilename}_thumbnail.jpg`,
      };
    }

    return {
      success: false,
      message: 'Browser-based video format conversion requires server-side processing. You can extract frames or create thumbnails instead.',
    };
  }

  static async downloadBlob(blob: Blob, filename: string): Promise<void> {
    saveAs(blob, filename);
  }

  static getSupportedConversions(sourceFormat: string): string[] {
    const conversions: Record<string, string[]> = {
      // Documents
      'md': ['html', 'pdf', 'docx', 'txt'],
      'txt': ['html', 'pdf', 'md'],
      'html': ['pdf', 'txt'],
      
      // Images
      'jpg': ['png', 'webp', 'bmp', 'gif'],
      'jpeg': ['png', 'webp', 'bmp', 'gif'],
      'png': ['jpg', 'webp', 'bmp', 'gif'],
      'webp': ['jpg', 'png', 'bmp', 'gif'],
      'gif': ['jpg', 'png', 'webp', 'bmp'],
      'bmp': ['jpg', 'png', 'webp', 'gif'],
      
      // Audio
      'mp3': ['wav'],
      'wav': ['wav'], // Can re-encode
      'ogg': ['wav'],
      'm4a': ['wav'],
      'aac': ['wav'],
      
      // Video (limited to frame extraction)
      'mp4': ['jpg', 'png', 'thumbnail'],
      'webm': ['jpg', 'png', 'thumbnail'],
      'avi': ['jpg', 'png', 'thumbnail'],
      'mov': ['jpg', 'png', 'thumbnail'],
      'mkv': ['jpg', 'png', 'thumbnail'],
    };

    return conversions[sourceFormat.toLowerCase()] || [];
  }
}