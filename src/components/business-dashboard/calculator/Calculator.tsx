
import React from "react";
import { Calculator as CalculatorIcon } from "lucide-react";
import { useCalculator } from "@/hooks/useCalculator";
import CalculatorDisplay from "./CalculatorDisplay";
import CalculatorKeypad from "./CalculatorKeypad";

const Calculator = () => {
  const { 
    state,
    clearDisplay,
    inputDigit,
    inputDecimal,
    handleOperator,
    calculateResult,
    handlePercent,
    toggleSign
  } = useCalculator();

  return (
    <div className="w-64 bg-white rounded-lg shadow-lg p-3">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center text-orange-500">
          <CalculatorIcon className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">Calculator</span>
        </div>
      </div>
      
      <CalculatorDisplay value={state.display} />
      
      <CalculatorKeypad 
        onDigitClick={inputDigit}
        onOperatorClick={handleOperator}
        onEqualClick={calculateResult}
        onClearClick={clearDisplay}
        onDecimalClick={inputDecimal}
        onPercentClick={handlePercent}
        onToggleSignClick={toggleSign}
      />
    </div>
  );
};

export default Calculator;
