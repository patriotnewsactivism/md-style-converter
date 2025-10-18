import { Upload } from "lucide-react";
import { useRef } from "react";

interface FileUploadProps {
  onFileSelect: (content: string, filename: string) => void;
}

export const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.md')) {
      alert('Please select a markdown (.md) file');
      return;
    }

    const content = await file.text();
    onFileSelect(content, file.name);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-12 border-2 border-dashed border-border rounded-xl bg-gradient-to-br from-secondary/30 to-transparent hover:border-primary transition-all duration-300">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent">
        <Upload className="w-8 h-8 text-primary-foreground" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Upload Markdown File
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Drop your .md file here or click to browse
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".md"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-medium cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          Select File
        </label>
      </div>
    </div>
  );
};
