
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { ExpensePaymentMethod } from '@/types/business-expense';
import { Loader2 } from 'lucide-react';

const PaymentMethodField = () => {
  const form = useFormContext();
  const { business } = useBusinessAuth();
  
  const { data: paymentMethods = [], isLoading } = useQuery({
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
  
  return (
    <FormField
      control={form.control}
      name="payment_method"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Payment Method</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Loading payment methods...</span>
                  </div>
                ) : (
                  <SelectValue placeholder="Select payment method" />
                )}
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {paymentMethods.map((method) => (
                <SelectItem key={method.id} value={method.id}>
                  {method.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PaymentMethodField;
