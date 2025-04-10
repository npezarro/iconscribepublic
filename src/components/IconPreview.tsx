
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface IconPreviewProps {
  selectedIcons: LucideIcon[];
}

const IconPreview = ({ selectedIcons }: IconPreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 p-4">
          {selectedIcons.map((IconComponent, index) => (
            IconComponent ? (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="p-4 border rounded-lg flex items-center justify-center bg-background">
                  <IconComponent className="h-10 w-10 text-primary" />
                </div>
                <span className="text-xs text-center text-muted-foreground">
                  Icon {index + 1}
                </span>
              </div>
            ) : (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="p-4 border rounded-lg flex items-center justify-center bg-muted">
                </div>
                <span className="text-xs text-center text-muted-foreground">
                  No selection
                </span>
              </div>
            )
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IconPreview;
