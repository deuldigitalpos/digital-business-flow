
import React from "react";
import { Button } from "@/components/ui/button";

interface CalculatorButtonProps {
  onClick: () => void;
  className?: string;
  variant?: "default" | "outline";
  children: React.ReactNode;
  colSpan?: number;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ 
  onClick, 
  className = "", 
  variant = "outline", 
  children, 
  colSpan = 1
}) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      className={`${className} ${colSpan > 1 ? `col-span-${colSpan}` : ''}`}
    >
      {children}
    </Button>
  );
};

export default CalculatorButton;
