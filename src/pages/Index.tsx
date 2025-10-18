import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { MarkdownPreview } from "@/components/MarkdownPreview";
import { ExportButtons } from "@/components/ExportButtons";
import { FileText } from "lucide-react";

const Index = () => {
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [filename, setFilename] = useState<string>("");

  const handleFileSelect = (content: string, name: string) => {
    setMarkdownContent(content);
    setFilename(name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Markdown Converter
              </h1>
              <p className="text-sm text-muted-foreground">
                View, convert to PDF & DOCX
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {!markdownContent ? (
          <div className="max-w-2xl mx-auto">
            <FileUpload onFileSelect={handleFileSelect} />
            
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">View Markdown</h3>
                <p className="text-sm text-muted-foreground">
                  Beautiful rendering with syntax highlighting
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Export to PDF</h3>
                <p className="text-sm text-muted-foreground">
                  Maintain styling and formatting
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Export to DOCX</h3>
                <p className="text-sm text-muted-foreground">
                  Convert to Microsoft Word format
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* File Info & Actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-card rounded-xl border border-border shadow-sm">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">
                  {filename}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ready to export
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <ExportButtons filename={filename} markdownContent={markdownContent} />
                <button
                  onClick={() => {
                    setMarkdownContent("");
                    setFilename("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  Upload New File
                </button>
              </div>
            </div>

            {/* Preview */}
            <MarkdownPreview content={markdownContent} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20">
        <div className="container mx-auto px-6 py-6 text-center text-sm text-muted-foreground">
          Built with React & Tailwind CSS
        </div>
      </footer>
    </div>
  );
};

export default Index;
