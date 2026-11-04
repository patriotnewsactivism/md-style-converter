import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ConversionPanel } from "@/components/ConversionPanel";
import { FilePreview } from "@/components/FilePreview";
import { FileCategory } from "@/lib/fileTypes";
import { RefreshCw } from "lucide-react";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileCategory, setFileCategory] = useState<FileCategory | null>(null);

  const handleFileSelect = (file: File, category: FileCategory) => {
    setSelectedFile(file);
    setFileCategory(category);
  };

  const handleNewFile = () => {
    setSelectedFile(null);
    setFileCategory(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent">
              <RefreshCw className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Universal File Converter
              </h1>
              <p className="text-sm text-muted-foreground">
                Convert documents, images, audio, and video files
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {!selectedFile ? (
          <FileUpload onFileSelect={handleFileSelect} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {/* Left Column - Preview */}
            <div className="space-y-6">
              {fileCategory && (
                <FilePreview file={selectedFile} category={fileCategory} />
              )}
            </div>

            {/* Right Column - Conversion Options */}
            <div className="space-y-6">
              {fileCategory && (
                <ConversionPanel
                  file={selectedFile}
                  category={fileCategory}
                  onNewFile={handleNewFile}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="container mx-auto px-6 py-6 text-center text-sm text-muted-foreground">
          Built with React, TypeScript & Tailwind CSS • Client-side processing for privacy
        </div>
      </footer>
    </div>
  );
};

export default Index;