
import React from "react";
import { Plus, Minus, X, Divide, Equal, Percent } from "lucide-react";
import CalculatorButton from "./CalculatorButton";
import { CalculatorOperation } from "@/hooks/useCalculator";

interface CalculatorKeypadProps {
  onDigitClick: (digit: string) => void;
  onOperatorClick: (operator: CalculatorOperation) => void;
  onEqualClick: () => void;
  onClearClick: () => void;
  onDecimalClick: () => void;
  onPercentClick: () => void;
  onToggleSignClick: () => void;
}

const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  onDigitClick,
  onOperatorClick,
  onEqualClick,
  onClearClick,
  onDecimalClick,
  onPercentClick,
  onToggleSignClick
}) => {
  return (
    <div className="grid grid-cols-4 gap-1">
      <CalculatorButton 
        onClick={onClearClick} 
        className="bg-orange-50 hover:bg-orange-100 text-orange-700"
      >
        AC
      </CalculatorButton>
      <CalculatorButton 
        onClick={onToggleSignClick} 
        className="bg-orange-50 hover:bg-orange-100 text-orange-700"
      >
        +/-
      </CalculatorButton>
      <CalculatorButton 
        onClick={onPercentClick} 
        className="bg-orange-50 hover:bg-orange-100 text-orange-700"
        icon={Percent}
      >
        %
      </CalculatorButton>
      <CalculatorButton 
        onClick={() => onOperatorClick("/")} 
        className="bg-orange-200 hover:bg-orange-300 text-orange-800"
        icon={Divide}
      >
        ÷
      </CalculatorButton>
      
      <CalculatorButton onClick={() => onDigitClick("7")}>7</CalculatorButton>
      <CalculatorButton onClick={() => onDigitClick("8")}>8</CalculatorButton>
      <CalculatorButton onClick={() => onDigitClick("9")}>9</CalculatorButton>
      <CalculatorButton 
        onClick={() => onOperatorClick("*")} 
        className="bg-orange-200 hover:bg-orange-300 text-orange-800"
        icon={X}
      >
        ×
      </CalculatorButton>
      
      <CalculatorButton onClick={() => onDigitClick("4")}>4</CalculatorButton>
      <CalculatorButton onClick={() => onDigitClick("5")}>5</CalculatorButton>
      <CalculatorButton onClick={() => onDigitClick("6")}>6</CalculatorButton>
      <CalculatorButton 
        onClick={() => onOperatorClick("-")} 
        className="bg-orange-200 hover:bg-orange-300 text-orange-800"
        icon={Minus}
      >
        −
      </CalculatorButton>
      
      <CalculatorButton onClick={() => onDigitClick("1")}>1</CalculatorButton>
      <CalculatorButton onClick={() => onDigitClick("2")}>2</CalculatorButton>
      <CalculatorButton onClick={() => onDigitClick("3")}>3</CalculatorButton>
      <CalculatorButton 
        onClick={() => onOperatorClick("+")} 
        className="bg-orange-200 hover:bg-orange-300 text-orange-800"
        icon={Plus}
      >
        +
      </CalculatorButton>
      
      <CalculatorButton 
        onClick={() => onDigitClick("0")} 
        colSpan={2}
      >
        0
      </CalculatorButton>
      <CalculatorButton onClick={onDecimalClick}>.</CalculatorButton>
      <CalculatorButton 
        onClick={onEqualClick} 
        className="bg-orange-500 hover:bg-orange-600 text-white"
        icon={Equal}
      >
        =
      </CalculatorButton>
    </div>
  );
};

export default CalculatorKeypad;
