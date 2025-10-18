import { FileDown, FileText } from "lucide-react";
import { Button } from "./ui/button";
import html2pdf from "html2pdf.js";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { toast } from "sonner";

interface ExportButtonsProps {
  filename: string;
  markdownContent: string;
}

export const ExportButtons = ({ filename, markdownContent }: ExportButtonsProps) => {
  const handleExportPDF = () => {
    const element = document.getElementById('markdown-preview');
    if (!element) {
      toast.error("No content to export");
      return;
    }

    const opt = {
      margin: 1,
      filename: filename.replace('.md', '.pdf'),
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save();
    toast.success("PDF exported successfully!");
  };

  const handleExportDOCX = async () => {
    try {
      // Parse markdown to create DOCX content
      const lines = markdownContent.split('\n');
      const paragraphs: any[] = [];

      for (const line of lines) {
        if (line.startsWith('# ')) {
          paragraphs.push(
            new Paragraph({
              text: line.replace('# ', ''),
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 },
            })
          );
        } else if (line.startsWith('## ')) {
          paragraphs.push(
            new Paragraph({
              text: line.replace('## ', ''),
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 150 },
            })
          );
        } else if (line.startsWith('### ')) {
          paragraphs.push(
            new Paragraph({
              text: line.replace('### ', ''),
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 200, after: 100 },
            })
          );
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
          paragraphs.push(
            new Paragraph({
              text: line.replace(/^[*-] /, ''),
              bullet: { level: 0 },
              spacing: { before: 100, after: 100 },
            })
          );
        } else if (line.trim()) {
          // Regular paragraph - handle bold and italic
          const children: TextRun[] = [];
          let currentText = line;
          
          // Simple bold/italic parser
          const parts = currentText.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/);
          for (const part of parts) {
            if (part.startsWith('**') && part.endsWith('**')) {
              children.push(new TextRun({ text: part.slice(2, -2), bold: true }));
            } else if (part.startsWith('*') && part.endsWith('*')) {
              children.push(new TextRun({ text: part.slice(1, -1), italics: true }));
            } else if (part.startsWith('`') && part.endsWith('`')) {
              children.push(new TextRun({ 
                text: part.slice(1, -1),
                font: "Courier New"
              }));
            } else if (part) {
              children.push(new TextRun(part));
            }
          }
          
          paragraphs.push(
            new Paragraph({
              children,
              spacing: { before: 100, after: 100 },
            })
          );
        } else {
          // Empty line
          paragraphs.push(new Paragraph({ text: "" }));
        }
      }

      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs,
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, filename.replace('.md', '.docx'));
      toast.success("DOCX exported successfully!");
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Failed to export DOCX");
    }
  };

  return (
    <div className="flex gap-4">
      <Button 
        onClick={handleExportPDF}
        className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300"
      >
        <FileDown className="w-4 h-4" />
        Export to PDF
      </Button>
      <Button 
        onClick={handleExportDOCX}
        className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300"
      >
        <FileText className="w-4 h-4" />
        Export to DOCX
      </Button>
    </div>
  );
};
