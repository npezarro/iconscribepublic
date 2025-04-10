
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IconOptionProps {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

const IconOption = ({ 
  selected, 
  onClick, 
  children,
  className
}: IconOptionProps) => {
  return (
    <div
      className={cn(
        "relative p-4 border rounded-md cursor-pointer transition-all",
        "hover:border-primary/50 hover:shadow-sm",
        selected ? "border-primary bg-primary/5 shadow-sm" : "border-border",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default IconOption;
