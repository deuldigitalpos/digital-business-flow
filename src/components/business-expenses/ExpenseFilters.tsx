
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
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { ExpenseCategory, ExpensePaymentMethod } from '@/types/business-expense';

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
  const { business } = useBusinessAuth();
  
  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['expense-categories', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      
      const { data, error } = await supabase
        .from('business_expense_categories')
        .select('*')
        .eq('business_id', business.id)
        .order('name');
      
      if (error) throw error;
      return data as ExpenseCategory[];
    },
    enabled: !!business?.id
  });
  
  // Fetch payment methods
  const { data: paymentMethods = [] } = useQuery({
    queryKey: ['expense-payment-methods', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      
      const { data, error } = await supabase
        .from('business_expense_payment_methods')
        .select('*')
        .eq('business_id', business.id)
        .order('name');
      
      if (error) throw error;
      return data as ExpensePaymentMethod[];
    },
    enabled: !!business?.id
  });

  // Get current category name for display
  const getCategoryName = () => {
    if (!categoryFilter) return 'All Categories';
    const category = categories.find(c => c.id === categoryFilter);
    return category ? `Category: ${category.name}` : 'All Categories';
  };
  
  // Get current payment method name for display
  const getPaymentMethodName = () => {
    if (!paymentMethodFilter) return 'All Payment Methods';
    const method = paymentMethods.find(m => m.id === paymentMethodFilter);
    return method ? `Payment: ${method.name}` : 'All Payment Methods';
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4">
      {/* Category filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="justify-between w-full sm:w-auto">
            {getCategoryName()}
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
                key={category.id} 
                onClick={() => onCategoryChange(category.id)}
              >
                <span>{category.name}</span>
                {categoryFilter === category.id && <Check className="w-4 h-4 ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Payment method filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="justify-between w-full sm:w-auto">
            {getPaymentMethodName()}
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
                key={method.id} 
                onClick={() => onPaymentMethodChange(method.id)}
              >
                <span>{method.name}</span>
                {paymentMethodFilter === method.id && <Check className="w-4 h-4 ml-auto" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ExpenseFilters;
