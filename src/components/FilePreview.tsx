import { useState, useEffect } from "react";
import { FileCategory } from "@/lib/fileTypes";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MarkdownPreview } from "./MarkdownPreview";
import { FileText, Image as ImageIcon, Music, Video as VideoIcon } from "lucide-react";

interface FilePreviewProps {
  file: File;
  category: FileCategory;
}

export const FilePreview = ({ file, category }: FilePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [textContent, setTextContent] = useState<string>("");

  useEffect(() => {
    const loadPreview = async () => {
      if (category === FileCategory.IMAGE || category === FileCategory.VIDEO) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      } else if (category === FileCategory.DOCUMENT) {
        const text = await file.text();
        setTextContent(text);
      } else if (category === FileCategory.AUDIO) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      }
    };

    loadPreview();
  }, [file, category]);

  const renderPreview = () => {
    switch (category) {
      case FileCategory.IMAGE:
        return (
          <div className="flex items-center justify-center p-8 bg-muted/30 rounded-lg">
            <img
              src={previewUrl}
              alt={file.name}
              className="max-w-full max-h-[500px] object-contain rounded-lg shadow-lg"
            />
          </div>
        );

      case FileCategory.VIDEO:
        return (
          <div className="flex items-center justify-center p-8 bg-muted/30 rounded-lg">
            <video
              src={previewUrl}
              controls
              className="max-w-full max-h-[500px] rounded-lg shadow-lg"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case FileCategory.AUDIO:
        return (
          <div className="flex flex-col items-center justify-center p-12 bg-muted/30 rounded-lg">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
              <Music className="w-10 h-10 text-primary-foreground" />
            </div>
            <audio src={previewUrl} controls className="w-full max-w-md">
              Your browser does not support the audio tag.
            </audio>
            <p className="text-sm text-muted-foreground mt-4">{file.name}</p>
          </div>
        );

      case FileCategory.DOCUMENT:
        const extension = file.name.split('.').pop()?.toLowerCase();
        
        if (extension === 'md') {
          return <MarkdownPreview content={textContent} />;
        } else if (extension === 'txt' || extension === 'html') {
          return (
            <div className="p-6 bg-muted/30 rounded-lg">
              <pre className="whitespace-pre-wrap break-words text-sm font-mono">
                {textContent}
              </pre>
            </div>
          );
        } else {
          return (
            <div className="flex flex-col items-center justify-center p-12 bg-muted/30 rounded-lg">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-primary-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Preview not available for this document type
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {file.name}
              </p>
            </div>
          );
        }

      default:
        return (
          <div className="flex items-center justify-center p-12 bg-muted/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Preview not available</p>
          </div>
        );
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case FileCategory.DOCUMENT:
        return <FileText className="w-5 h-5" />;
      case FileCategory.IMAGE:
        return <ImageIcon className="w-5 h-5" />;
      case FileCategory.AUDIO:
        return <Music className="w-5 h-5" />;
      case FileCategory.VIDEO:
        return <VideoIcon className="w-5 h-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getCategoryIcon()}
          File Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderPreview()}
      </CardContent>
    </Card>
  );
};