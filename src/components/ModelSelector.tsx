
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown } from "lucide-react";

type AIProvider = "openai" | "mockapi";

interface ModelSelectorProps {
  currentProvider: AIProvider;
  onChangeProvider: (provider: AIProvider) => void;
}

const ModelSelector = ({ currentProvider, onChangeProvider }: ModelSelectorProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1 w-[160px] justify-between">
          <span className="truncate">
            {currentProvider === "openai" ? "OpenAI" : "Demo Provider"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem
          className="flex items-center justify-between"
          onClick={() => onChangeProvider("openai")}
        >
          <span>OpenAI</span>
          {currentProvider === "openai" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center justify-between"
          onClick={() => onChangeProvider("mockapi")}
        >
          <span>Demo Provider</span>
          {currentProvider === "mockapi" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModelSelector;
