
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Plus, Trash2, Upload, X, Image, AlertTriangle, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import IconDisplay from "./IconDisplay";
import IconPreview from "./IconPreview";
import ReferenceImageGallery from "./ReferenceImageGallery";
import { LucideIcon } from "lucide-react";
import * as icons from "lucide-react";
import { DEFAULT_REFERENCE_IMAGES } from "@/lib/constants";
import ModelSelector from "./ModelSelector";

interface IconGeneratorProps {
  apiKey: string;
  onClearApiKey: () => void;
}

interface IconSet {
  description: string;
  options: LucideIcon[];
  selectedIndex: number;
  loading: boolean;
  error?: string;
}

type AIProvider = "openai" | "mockapi";

const MAX_ICONS = 4;
const initialIconState: IconSet = {
  description: "",
  options: [],
  selectedIndex: -1,
  loading: false,
};

const IconGenerator = ({ apiKey, onClearApiKey }: IconGeneratorProps) => {
  const [iconSets, setIconSets] = useState<IconSet[]>([{ ...initialIconState }]);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [generalError, setGeneralError] = useState<string | undefined>(undefined);
  const [provider, setProvider] = useState<AIProvider>("openai");
  const { toast } = useToast();

  useEffect(() => {
    setReferenceImages([...DEFAULT_REFERENCE_IMAGES]);
  }, []);

  const addIconSet = () => {
    if (iconSets.length >= MAX_ICONS) {
      toast({
        title: "Maximum Icons Reached",
        description: `You can only create up to ${MAX_ICONS} icons at once.`,
        variant: "destructive",
      });
      return;
    }
    setIconSets([...iconSets, { ...initialIconState }]);
  };

  const removeIconSet = (index: number) => {
    if (iconSets.length <= 1) {
      toast({
        description: "You must have at least one icon.",
        variant: "destructive",
      });
      return;
    }
    setIconSets(iconSets.filter((_, i) => i !== index));
  };

  const updateDescription = (index: number, description: string) => {
    const newIconSets = [...iconSets];
    newIconSets[index] = { ...newIconSets[index], description };
    setIconSets(newIconSets);
  };

  const selectIconOption = (setIndex: number, optionIndex: number) => {
    const newIconSets = [...iconSets];
    newIconSets[setIndex] = { ...newIconSets[setIndex], selectedIndex: optionIndex };
    setIconSets(newIconSets);
  };

  const getSelectedIcons = () => {
    return iconSets.map(set => 
      set.selectedIndex >= 0 && set.options.length > 0 
        ? set.options[set.selectedIndex] 
        : null
    );
  };

  const handleAddReferenceImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    if (referenceImages.length >= 6) {
      toast({
        title: "Maximum Images Reached",
        description: "You can only upload up to 6 reference images.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setReferenceImages([...referenceImages, event.target.result as string]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveReferenceImage = (index: number) => {
    setReferenceImages(referenceImages.filter((_, i) => i !== index));
  };

  const generateIconsWithMockAPI = async (description: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const commonIcons = [
      "Bell", "User", "ShoppingCart", "Heart", "Star", 
      "Settings", "Home", "Calendar", "Mail", "Search",
      "Map", "Music", "Video", "Camera", "Bookmark"
    ];
    
    const randomIcons: string[] = [];
    while (randomIcons.length < 3) {
      const icon = commonIcons[Math.floor(Math.random() * commonIcons.length)];
      if (!randomIcons.includes(icon)) {
        randomIcons.push(icon);
      }
    }
    
    return randomIcons;
  };

  const generateIcons = async (index: number) => {
    const iconSet = iconSets[index];
    
    if (!iconSet.description.trim()) {
      toast({
        title: "Empty Description",
        description: "Please enter a description for your icon.",
        variant: "destructive",
      });
      return;
    }
    
    setGeneralError(undefined);
    const newIconSets = [...iconSets];
    newIconSets[index] = { 
      ...newIconSets[index], 
      loading: true,
      error: undefined
    };
    setIconSets(newIconSets);
    
    try {
      let iconNames: string[];
      
      if (provider === "openai") {
        let prompt = `Icon description: "${iconSet.description}"`;
        if (referenceImages.length > 0) {
          prompt += `. Match the style of the ${referenceImages.length} reference images I've uploaded. These are colorful, simple, cartoon-style icons with clean shapes and solid colors.`;
        }
        
        // Ensure API key is properly trimmed and formatted
        const cleanApiKey = apiKey.trim();

        // Updated model - using gpt-4o-mini
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cleanApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `You are an expert icon selector. Given a description, you'll find the best matching Lucide React icons (https://lucide.dev/icons). 
                Only select from the Lucide icon library. Your response should be valid JSON that contains ONLY an array of icon names (string[]), with no explanation.
                Provide exactly 3 icon suggestions that best match the description.`
              },
              {
                role: "user",
                content: `${prompt}. Return JSON array with exactly 3 icon names from the Lucide library.`
              },
            ],
            temperature: 0.7,
            max_tokens: 150,
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("OpenAI API error:", errorData);
          
          if (response.status === 429) {
            throw new Error("Rate limit exceeded. Please try again later or switch to Demo Provider.");
          } else if (errorData.error) {
            throw new Error(errorData.error.message || "Error calling OpenAI API");
          } else {
            throw new Error(`HTTP error ${response.status}`);
          }
        }
        
        const data = await response.json();
        let content = data.choices[0].message.content;
        
        try {
          // Parse content directly as JSON
          iconNames = JSON.parse(content);
          if (!Array.isArray(iconNames)) {
            throw new Error("Response is not an array");
          }
        } catch (e) {
          // Fallback parsing if direct parsing fails
          console.log("Failed to parse directly, trying fallback parsing:", content);
          const match = content.match(/\[(.*)\]/);
          if (match) {
            try {
              iconNames = JSON.parse(`[${match[1]}]`);
            } catch {
              throw new Error("Failed to parse icon names from response");
            }
          } else {
            throw new Error("Invalid response format");
          }
        }
      } else {
        iconNames = await generateIconsWithMockAPI(iconSet.description);
      }
      
      const validIconNames = iconNames
        .slice(0, 3)
        .filter(name => typeof name === 'string')
        .map(name => {
          // Convert kebab-case or spaces to PascalCase for Lucide icons
          return name.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
                     .replace(/\s+([a-z])/gi, (g) => g[1].toUpperCase())
                     .replace(/^[a-z]/, (g) => g.toUpperCase());
        })
        .filter(name => icons[name as keyof typeof icons]);
      
      console.log("Valid icon names:", validIconNames);
      
      const iconComponents = validIconNames.map(name => icons[name as keyof typeof icons] as LucideIcon);
      
      const updatedIconSets = [...iconSets];
      updatedIconSets[index] = {
        ...updatedIconSets[index],
        options: iconComponents,
        loading: false,
        selectedIndex: iconComponents.length > 0 ? 0 : -1,
        error: undefined
      };
      setIconSets(updatedIconSets);
      
    } catch (error) {
      console.error("Error generating icons:", error);
      
      let errorMessage = "Failed to generate icons";
      if (error instanceof Error) {
        errorMessage = error.message;
        
        if (errorMessage.includes("rate limit") || 
            errorMessage.includes("exceeded") || 
            errorMessage.includes("insufficient_quota")) {
          errorMessage = "API rate limit or quota exceeded. Try switching to the Demo Provider in settings.";
          setGeneralError(errorMessage);
          
          toast({
            title: "API Limit Reached",
            description: "Please try again later or switch to the Demo Provider in settings.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
        }
      }
      
      const updatedIconSets = [...iconSets];
      updatedIconSets[index] = { 
        ...updatedIconSets[index], 
        loading: false,
        error: errorMessage
      };
      setIconSets(updatedIconSets);
    }
  };
  
  const handleChangeProvider = (newProvider: AIProvider) => {
    setProvider(newProvider);
    setGeneralError(undefined);
    
    toast({
      title: newProvider === "openai" ? "Using OpenAI" : "Using Demo Provider",
      description: newProvider === "openai" 
        ? "Using OpenAI for icon generation." 
        : "Using demo provider for icon generation. Results are randomized.",
    });
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Icon Generator</h2>
        <div className="flex items-center gap-2">
          <ModelSelector 
            currentProvider={provider}
            onChangeProvider={handleChangeProvider}
          />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearApiKey} 
            className="flex items-center gap-1"
          >
            <LogOut className="h-4 w-4" />
            Change API Key
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="space-y-8">
          <ReferenceImageGallery 
            referenceImages={referenceImages}
            onAddImage={handleAddReferenceImage}
            onRemoveImage={handleRemoveReferenceImage}
            error={generalError}
            apiKey={apiKey}
          />
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {iconSets.map((iconSet, index) => (
              <div key={index} className="relative">
                <Card className="mb-4">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-md font-medium">
                      Icon {index + 1} Description
                    </CardTitle>
                    {iconSets.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIconSet(index)}
                        aria-label="Remove icon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Describe your icon (e.g., 'shopping cart', 'notification bell', 'user profile')"
                        value={iconSet.description}
                        onChange={(e) => updateDescription(index, e.target.value)}
                        className="resize-none"
                      />
                      
                      {iconSet.error && (
                        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                          <span>{iconSet.error}</span>
                        </div>
                      )}
                      
                      <Button
                        onClick={() => generateIcons(index)}
                        disabled={iconSet.loading}
                        className="w-full"
                      >
                        {iconSet.loading ? (
                          <>
                            <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Icon Options
                          </>
                        )}
                      </Button>
                      
                      <div className="text-xs text-muted-foreground">
                        Using {provider === "openai" ? "OpenAI gpt-4o-mini" : "Demo Provider (Random)"} 
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <IconDisplay
                  title={`Icon ${index + 1} Options`}
                  description="Select the best option below"
                  options={iconSet.options}
                  loading={iconSet.loading}
                  selectedIndex={iconSet.selectedIndex}
                  onSelect={(optionIndex) => selectIconOption(index, optionIndex)}
                />
              </div>
            ))}
          </div>
          
          {iconSets.length < MAX_ICONS && (
            <Button 
              variant="outline" 
              onClick={addIconSet}
              className="w-full max-w-[300px] mx-auto block"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Icon
            </Button>
          )}
        </TabsContent>
        
        <TabsContent value="preview">
          <IconPreview selectedIcons={getSelectedIcons().filter(Boolean) as LucideIcon[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IconGenerator;
