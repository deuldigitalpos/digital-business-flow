
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Calculator as CalculatorIcon,
  Plus,
  Minus,
  X,
  Divide,
  Equal,
  RotateCcw,
  Percent
} from "lucide-react";

const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const clearDisplay = () => {
    setDisplay("0");
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === "0" ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay("0.");
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation(operator, firstOperand, inputValue);
      
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = (op: string, first: number, second: number): number => {
    switch (op) {
      case '+':
        return first + second;
      case '-':
        return first - second;
      case '*':
        return first * second;
      case '/':
        return second !== 0 ? first / second : 0; // Simple divide by zero check
      case '%':
        return first % second;
      default:
        return second;
    }
  };
  
  const calculateResult = () => {
    if (firstOperand === null || operator === null) return;
    
    const inputValue = parseFloat(display);
    const result = performCalculation(operator, firstOperand, inputValue);
    
    setDisplay(String(result));
    setFirstOperand(result);
    setOperator(null);
    setWaitingForSecondOperand(true);
  };

  const handlePercent = () => {
    const currentValue = parseFloat(display);
    const percentValue = currentValue / 100;
    setDisplay(String(percentValue));
  };
  
  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay(String(-1 * value));
  };

  return (
    <div className="w-64 bg-white rounded-lg shadow-lg p-3">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center text-orange-500">
          <CalculatorIcon className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">Calculator</span>
        </div>
      </div>
      
      <div className="bg-gray-100 p-3 rounded-md mb-2 text-right">
        <div className="text-2xl font-mono">{display}</div>
      </div>
      
      <div className="grid grid-cols-4 gap-1">
        <Button 
          onClick={clearDisplay} 
          variant="outline" 
          className="bg-orange-50 hover:bg-orange-100 text-orange-700"
        >
          AC
        </Button>
        <Button 
          onClick={toggleSign} 
          variant="outline" 
          className="bg-orange-50 hover:bg-orange-100 text-orange-700"
        >
          +/-
        </Button>
        <Button 
          onClick={handlePercent} 
          variant="outline" 
          className="bg-orange-50 hover:bg-orange-100 text-orange-700"
        >
          <Percent className="h-4 w-4" />
        </Button>
        <Button 
          onClick={() => handleOperator('/')} 
          variant="outline" 
          className="bg-orange-200 hover:bg-orange-300 text-orange-800"
        >
          <Divide className="h-4 w-4" />
        </Button>
        
        <Button onClick={() => inputDigit('7')} variant="outline">7</Button>
        <Button onClick={() => inputDigit('8')} variant="outline">8</Button>
        <Button onClick={() => inputDigit('9')} variant="outline">9</Button>
        <Button 
          onClick={() => handleOperator('*')} 
          variant="outline" 
          className="bg-orange-200 hover:bg-orange-300 text-orange-800"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <Button onClick={() => inputDigit('4')} variant="outline">4</Button>
        <Button onClick={() => inputDigit('5')} variant="outline">5</Button>
        <Button onClick={() => inputDigit('6')} variant="outline">6</Button>
        <Button 
          onClick={() => handleOperator('-')} 
          variant="outline" 
          className="bg-orange-200 hover:bg-orange-300 text-orange-800"
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <Button onClick={() => inputDigit('1')} variant="outline">1</Button>
        <Button onClick={() => inputDigit('2')} variant="outline">2</Button>
        <Button onClick={() => inputDigit('3')} variant="outline">3</Button>
        <Button 
          onClick={() => handleOperator('+')} 
          variant="outline" 
          className="bg-orange-200 hover:bg-orange-300 text-orange-800"
        >
          <Plus className="h-4 w-4" />
        </Button>
        
        <Button 
          onClick={() => inputDigit('0')} 
          variant="outline" 
          className="col-span-2"
        >
          0
        </Button>
        <Button onClick={inputDecimal} variant="outline">.</Button>
        <Button 
          onClick={calculateResult} 
          variant="outline" 
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Equal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Calculator;
