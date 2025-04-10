
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ApiKeyForm from "@/components/ApiKeyForm";
import IconGenerator from "@/components/IconGenerator";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [apiKey, setApiKey] = useState<string>("");
  
  // Check if API key exists in localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("openai-api-key");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);
  
  const handleApiKeySubmit = (key: string) => {
    // Make sure to trim any whitespace
    const trimmedKey = key.trim();
    if (!trimmedKey.startsWith('sk-')) {
      console.error("Invalid API key format");
      return;
    }
    setApiKey(trimmedKey);
    localStorage.setItem("openai-api-key", trimmedKey);
  };

  const handleClearApiKey = () => {
    setApiKey("");
    localStorage.removeItem("openai-api-key");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {apiKey ? (
          <IconGenerator 
            apiKey={apiKey} 
            onClearApiKey={handleClearApiKey}
          />
        ) : (
          <ApiKeyForm onApiKeySubmit={handleApiKeySubmit} />
        )}
      </main>
      <footer className="py-6 border-t">
        <div className="container flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm text-muted-foreground">
            Icon Scribe AI - Powered by OpenAI and Lucide React Icons
          </p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Index;
