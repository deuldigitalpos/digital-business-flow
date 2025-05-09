
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { categories, paymentMethods } from './expense-form/types';

interface ExpenseFiltersProps {
  categoryFilter: string | null;
  paymentMethodFilter: string | null;
  onCategoryChange: (category: string | null) => void;
  onPaymentMethodChange: (paymentMethod: string | null) => void;
}

const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  categoryFilter,
  paymentMethodFilter,
  onCategoryChange,
  onPaymentMethodChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      {/* Category filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="justify-between w-full sm:w-auto">
            {categoryFilter ? `Category: ${categoryFilter}` : 'All Categories'}
            <span className="sr-only">Toggle category menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => onCategoryChange(null)}>
              <span>All Categories</span>
              {categoryFilter === null && <Check className="w-4 h-4 ml-auto" />}
            </DropdownMenuItem>
            {categories.map((category) => (
              <DropdownMenuItem 
                key={category} 
                onClick={() => onCategoryChange(category)}
              >
                <span>{category}</span>
                {categoryFilter === category && <Check className="w-4 h-4 ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Payment method filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="justify-between w-full sm:w-auto">
            {paymentMethodFilter ? `Payment: ${paymentMethodFilter}` : 'All Payment Methods'}
            <span className="sr-only">Toggle payment method menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Filter by payment method</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => onPaymentMethodChange(null)}>
              <span>All Payment Methods</span>
              {paymentMethodFilter === null && <Check className="w-4 h-4 ml-auto" />}
            </DropdownMenuItem>
            {paymentMethods.map((method) => (
              <DropdownMenuItem 
                key={method} 
                onClick={() => onPaymentMethodChange(method)}
              >
                <span>{method}</span>
                {paymentMethodFilter === method && <Check className="w-4 h-4 ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ExpenseFilters;
