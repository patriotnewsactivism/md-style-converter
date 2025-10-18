import { useState } from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { FileCategory, getFileExtension } from "@/lib/fileTypes";
import { ConversionService } from "@/lib/conversionService";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface ConversionPanelProps {
  file: File;
  category: FileCategory;
  onNewFile: () => void;
}

export const ConversionPanel = ({ file, category, onNewFile }: ConversionPanelProps) => {
  const [targetFormat, setTargetFormat] = useState<string>("");
  const [isConverting, setIsConverting] = useState(false);
  const [imageQuality, setImageQuality] = useState([92]);
  const [imageWidth, setImageWidth] = useState<string>("");
  const [imageHeight, setImageHeight] = useState<string>("");

  const sourceFormat = getFileExtension(file.name);
  const supportedFormats = ConversionService.getSupportedConversions(sourceFormat);

  const handleConvert = async () => {
    if (!targetFormat) {
      toast.error("Please select a target format");
      return;
    }

    setIsConverting(true);
    
    try {
      const options: any = {};
      
      // Add category-specific options
      if (category === FileCategory.IMAGE) {
        options.quality = imageQuality[0] / 100;
        if (imageWidth) options.width = parseInt(imageWidth);
        if (imageHeight) options.height = parseInt(imageHeight);
        options.maintainAspectRatio = true;
      }

      const result = await ConversionService.convert(file, targetFormat, options);
      
      if (result.success) {
        toast.success(result.message);
        if (result.blob && result.filename) {
          await ConversionService.downloadBlob(result.blob, result.filename);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Conversion failed");
    } finally {
      setIsConverting(false);
    }
  };

  const getFileSize = () => {
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB < 1) {
      return `${(file.size / 1024).toFixed(2)} KB`;
    }
    return `${sizeInMB.toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* File Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{file.name}</span>
            <Button variant="outline" size="sm" onClick={onNewFile}>
              Upload New File
            </Button>
          </CardTitle>
          <CardDescription>
            {category.charAt(0).toUpperCase() + category.slice(1)} • {sourceFormat.toUpperCase()} • {getFileSize()}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Conversion Options Card */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Options</CardTitle>
          <CardDescription>Select the target format and configure options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Target Format Selection */}
          <div className="space-y-2">
            <Label htmlFor="target-format">Target Format</Label>
            <Select value={targetFormat} onValueChange={setTargetFormat}>
              <SelectTrigger id="target-format">
                <SelectValue placeholder="Select format..." />
              </SelectTrigger>
              <SelectContent>
                {supportedFormats.map((format) => (
                  <SelectItem key={format} value={format}>
                    {format.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image-specific options */}
          {category === FileCategory.IMAGE && targetFormat && (
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium text-sm">Image Options</h4>
              
              {/* Quality Slider */}
              {(targetFormat === 'jpg' || targetFormat === 'jpeg' || targetFormat === 'webp') && (
                <div className="space-y-2">
                  <Label>Quality: {imageQuality[0]}%</Label>
                  <Slider
                    value={imageQuality}
                    onValueChange={setImageQuality}
                    min={1}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Width (px)</Label>
                  <input
                    id="width"
                    type="number"
                    placeholder="Auto"
                    value={imageWidth}
                    onChange={(e) => setImageWidth(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (px)</Label>
                  <input
                    id="height"
                    type="number"
                    placeholder="Auto"
                    value={imageHeight}
                    onChange={(e) => setImageHeight(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Leave dimensions empty to keep original size. Aspect ratio will be maintained.
              </p>
            </div>
          )}

          {/* Audio/Video info */}
          {(category === FileCategory.AUDIO || category === FileCategory.VIDEO) && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                {category === FileCategory.AUDIO && 
                  "Browser-based audio conversion is limited to WAV format. For other formats, consider using server-side tools."}
                {category === FileCategory.VIDEO && 
                  "Browser-based video conversion is limited. You can extract frames or create thumbnails."}
              </p>
            </div>
          )}

          {/* Convert Button */}
          <Button
            onClick={handleConvert}
            disabled={!targetFormat || isConverting}
            className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300"
            size="lg"
          >
            {isConverting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Convert & Download
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};