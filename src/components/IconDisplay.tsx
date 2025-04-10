
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Icon } from "lucide-react";
import IconOption from "./IconOption";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconDisplayProps {
  title: string;
  description: string;
  options: LucideIcon[];
  loading: boolean;
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const IconDisplay = ({
  title,
  description,
  options,
  loading,
  selectedIndex,
  onSelect,
}: IconDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {loading && (
            <Badge variant="outline" className="ml-2">
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Generating
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-muted rounded-md loading-icon flex items-center justify-center"
              />
            ))}
          </div>
        ) : options.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {options.map((IconComponent, index) => (
              <IconOption
                key={index}
                selected={index === selectedIndex}
                onClick={() => onSelect(index)}
              >
                <div className="flex items-center justify-center h-full">
                  <IconComponent className={cn(
                    "h-8 w-8",
                    index === selectedIndex ? "text-primary" : "text-foreground"
                  )} />
                </div>
              </IconOption>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No icons generated yet. Enter a description and click generate.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IconDisplay;
