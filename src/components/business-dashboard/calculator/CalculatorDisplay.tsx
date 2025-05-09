
import React from "react";

interface CalculatorDisplayProps {
  value: string;
}

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({ value }) => {
  return (
    <div className="bg-gray-100 p-3 rounded-md mb-2 text-right">
      <div className="text-2xl font-mono overflow-hidden text-ellipsis">{value}</div>
    </div>
  );
};

export default CalculatorDisplay;
