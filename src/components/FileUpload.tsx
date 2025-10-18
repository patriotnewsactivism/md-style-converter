import { Upload, FileText, Image, Music, Video } from "lucide-react";
import { useRef, useState } from "react";
import { FileCategory, getFileCategory, getAcceptString, isFileTypeSupported } from "@/lib/fileTypes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FileUploadProps {
  onFileSelect: (file: File, category: FileCategory) => void;
}

export const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>(FileCategory.DOCUMENT);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isFileTypeSupported(file.name)) {
      alert('This file type is not supported. Please select a supported file format.');
      return;
    }

    const category = getFileCategory(file.name);
    if (!category) {
      alert('Unable to determine file type.');
      return;
    }

    onFileSelect(file, category);
  };

  const getCategoryIcon = (category: FileCategory) => {
    switch (category) {
      case FileCategory.DOCUMENT:
        return <FileText className="w-5 h-5" />;
      case FileCategory.IMAGE:
        return <Image className="w-5 h-5" />;
      case FileCategory.AUDIO:
        return <Music className="w-5 h-5" />;
      case FileCategory.VIDEO:
        return <Video className="w-5 h-5" />;
    }
  };

  const getCategoryDescription = (category: FileCategory) => {
    switch (category) {
      case FileCategory.DOCUMENT:
        return 'MD, PDF, DOCX, TXT, HTML, RTF';
      case FileCategory.IMAGE:
        return 'JPG, PNG, GIF, WEBP, BMP, SVG';
      case FileCategory.AUDIO:
        return 'MP3, WAV, OGG, FLAC, AAC, M4A';
      case FileCategory.VIDEO:
        return 'MP4, WEBM, AVI, MOV, MKV';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as FileCategory)}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value={FileCategory.DOCUMENT} className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Documents</span>
          </TabsTrigger>
          <TabsTrigger value={FileCategory.IMAGE} className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            <span className="hidden sm:inline">Images</span>
          </TabsTrigger>
          <TabsTrigger value={FileCategory.AUDIO} className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            <span className="hidden sm:inline">Audio</span>
          </TabsTrigger>
          <TabsTrigger value={FileCategory.VIDEO} className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            <span className="hidden sm:inline">Video</span>
          </TabsTrigger>
        </TabsList>

        {Object.values(FileCategory).map((category) => (
          <TabsContent key={category} value={category}>
            <div className="flex flex-col items-center justify-center gap-4 p-12 border-2 border-dashed border-border rounded-xl bg-gradient-to-br from-secondary/30 to-transparent hover:border-primary transition-all duration-300">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent">
                <Upload className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
                  {getCategoryIcon(category)}
                  Upload {category.charAt(0).toUpperCase() + category.slice(1)} File
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Drop your file here or click to browse
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Supported formats: {getCategoryDescription(category)}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={getAcceptString(category)}
                  onChange={handleFileChange}
                  className="hidden"
                  id={`file-upload-${category}`}
                />
                <label
                  htmlFor={`file-upload-${category}`}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-medium cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Select File
                </label>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Multi-Format Support</h3>
          <p className="text-sm text-muted-foreground">
            Convert between documents, images, audio, and video formats
          </p>
        </div>
        
        <div className="p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
            <Image className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">High Quality</h3>
          <p className="text-sm text-muted-foreground">
            Maintain quality and formatting during conversion
          </p>
        </div>
        
        <div className="p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
            <Upload className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Fast & Secure</h3>
          <p className="text-sm text-muted-foreground">
            Client-side processing keeps your files private
          </p>
        </div>
      </div>
    </div>
  );
};