
import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface CalculatorButtonProps {
  onClick: () => void;
  className?: string;
  variant?: "default" | "outline";
  children: React.ReactNode;
  colSpan?: number;
  icon?: LucideIcon;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ 
  onClick, 
  className = "", 
  variant = "outline", 
  children, 
  colSpan = 1,
  icon: Icon
}) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      className={`${className} ${colSpan > 1 ? `col-span-${colSpan}` : ''}`}
    >
      {Icon && <Icon className="h-4 w-4 mr-1" />}
      {children}
    </Button>
  );
};

export default CalculatorButton;
