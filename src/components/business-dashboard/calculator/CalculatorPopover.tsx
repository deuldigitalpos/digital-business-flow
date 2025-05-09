
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calculator as CalculatorIcon } from "lucide-react";
import Calculator from "./Calculator";

interface CalculatorPopoverProps {
  className?: string;
}

const CalculatorPopover = ({ className }: CalculatorPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className={`rounded-full border-orange-200 hover:bg-orange-50 hover:text-orange-600 ${className}`} 
          title="Calculator"
        >
          <CalculatorIcon className="h-4 w-4" />
          <span className="sr-only">Calculator</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0 w-auto border-orange-100">
        <Calculator />
      </PopoverContent>
    </Popover>
  );
};

export default CalculatorPopover;
