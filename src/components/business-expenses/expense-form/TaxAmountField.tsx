
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

const TaxAmountField = () => {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name="tax_amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tax Amount</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              step="0.01" 
              placeholder="0.00" 
              {...field} 
              value={field.value || ''} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TaxAmountField;
