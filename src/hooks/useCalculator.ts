
import { useState } from "react";

export type CalculatorOperation = "+" | "-" | "*" | "/" | "%" | null;

export interface CalculatorState {
  display: string;
  firstOperand: number | null;
  operator: CalculatorOperation;
  waitingForSecondOperand: boolean;
}

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>({
    display: "0",
    firstOperand: null,
    operator: null,
    waitingForSecondOperand: false
  });

  const clearDisplay = () => {
    setState({
      display: "0",
      firstOperand: null,
      operator: null,
      waitingForSecondOperand: false
    });
  };

  const inputDigit = (digit: string) => {
    const { display, waitingForSecondOperand } = state;
    
    if (waitingForSecondOperand) {
      setState({
        ...state,
        display: digit,
        waitingForSecondOperand: false
      });
    } else {
      setState({
        ...state,
        display: display === "0" ? digit : display + digit
      });
    }
  };

  const inputDecimal = () => {
    const { display, waitingForSecondOperand } = state;
    
    if (waitingForSecondOperand) {
      setState({
        ...state,
        display: "0.",
        waitingForSecondOperand: false
      });
      return;
    }

    if (!display.includes(".")) {
      setState({
        ...state,
        display: display + "."
      });
    }
  };

  const performCalculation = (
    op: CalculatorOperation, 
    first: number, 
    second: number
  ): number => {
    if (!op) return second;
    
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

  const handleOperator = (nextOperator: CalculatorOperation) => {
    const { firstOperand, display, operator } = state;
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setState({
        ...state,
        firstOperand: inputValue,
        waitingForSecondOperand: true,
        operator: nextOperator
      });
    } else if (operator) {
      const result = performCalculation(operator, firstOperand, inputValue);
      
      setState({
        ...state,
        display: String(result),
        firstOperand: result,
        waitingForSecondOperand: true,
        operator: nextOperator
      });
    }
  };
  
  const calculateResult = () => {
    const { firstOperand, operator, display } = state;
    
    if (firstOperand === null || operator === null) return;
    
    const inputValue = parseFloat(display);
    const result = performCalculation(operator, firstOperand, inputValue);
    
    setState({
      display: String(result),
      firstOperand: result,
      operator: null,
      waitingForSecondOperand: true
    });
  };

  const handlePercent = () => {
    const { display } = state;
    const currentValue = parseFloat(display);
    const percentValue = currentValue / 100;
    
    setState({
      ...state,
      display: String(percentValue)
    });
  };
  
  const toggleSign = () => {
    const { display } = state;
    const value = parseFloat(display);
    
    setState({
      ...state,
      display: String(-1 * value)
    });
  };

  return {
    state,
    clearDisplay,
    inputDigit,
    inputDecimal,
    handleOperator,
    calculateResult,
    handlePercent,
    toggleSign
  };
}
