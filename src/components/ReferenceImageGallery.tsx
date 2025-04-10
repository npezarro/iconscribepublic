
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, Plus, EyeIcon, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReferenceImageGalleryProps {
  referenceImages: string[];
  onAddImage: (file: File) => void;
  onRemoveImage: (index: number) => void;
  error?: string;
  apiKey?: string;
}

const ReferenceImageGallery = ({ 
  referenceImages, 
  onAddImage, 
  onRemoveImage,
  error,
  apiKey
}: ReferenceImageGalleryProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAddImage(file);
    }
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  const toggleApiKeyVisibility = () => {
    setShowApiKey(prev => !prev);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Reference Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && apiKey && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription className="space-y-2">
                <div>{error}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-medium">API Key:</span>
                  <code className="bg-destructive/20 px-2 py-0.5 rounded text-xs font-mono">
                    {showApiKey ? apiKey : apiKey.substring(0, 8) + '...' + apiKey.substring(apiKey.length - 4)}
                  </code>
                  <Button variant="outline" size="sm" onClick={toggleApiKeyVisibility} className="h-7 px-2">
                    {showApiKey ? <EyeOff className="h-3.5 w-3.5" /> : <EyeIcon className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              ref={fileInputRef}
              id="reference-image"
            />
            <Button 
              onClick={() => fileInputRef?.current?.click()}
              variant="outline"
              className="flex-1"
              disabled={referenceImages.length >= 6}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Reference Image
            </Button>
          </div>
          
          {referenceImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {referenceImages.map((imageUrl, index) => (
                <div key={index} className="relative group border rounded-md overflow-hidden aspect-square">
                  <img 
                    src={imageUrl} 
                    alt={`Reference ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <Button 
                    onClick={() => onRemoveImage(index)}
                    variant="destructive"
                    size="icon"
                    className={cn(
                      "absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity",
                      "focus:opacity-100"
                    )}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              
              {referenceImages.length < 6 && (
                <Button
                  variant="outline"
                  className="aspect-square flex flex-col items-center justify-center border border-dashed"
                  onClick={() => fileInputRef?.current?.click()}
                >
                  <Plus className="h-6 w-6 mb-1 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Add Image</span>
                </Button>
              )}
            </div>
          ) : (
            <div className="border border-dashed rounded-md p-8 flex flex-col items-center justify-center gap-2 text-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Upload reference images to guide the icon style</p>
                <p className="text-xs text-muted-foreground mt-1">Recommended for better results</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferenceImageGallery;
