
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useBusinessUnits } from '@/hooks/useBusinessUnits';
import { IngredientFormValues } from './types';

interface UnitSelectProps {
  form: UseFormReturn<IngredientFormValues>;
}

// Helper function to ensure we never have empty string values
const getSafeValue = (value: string | null | undefined, prefix: string, name: string | null | undefined): string => {
  // If we have a valid ID and it's not an empty string, use it
  if (value && value.trim() !== '') return value;
  
  // Generate a unique fallback value with sanitized name
  const safeName = name && name.trim() !== '' ? name.trim() : 'unnamed';
  return `${prefix}-${safeName}-${Math.random().toString(36).substring(2, 9)}`;
};

export const UnitSelect: React.FC<UnitSelectProps> = ({ form }) => {
  const { data: units = [] } = useBusinessUnits();
  
  return (
    <FormField
      control={form.control}
      name="unit_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Unit</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value || undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a unit" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {(units || []).map(unit => {
                // Generate a guaranteed non-empty value for each unit
                const safeValue = getSafeValue(unit.id, 'unit', unit.name);
                return (
                  <SelectItem
                    key={safeValue}
                    value={safeValue}
                  >
                    {unit.name || 'Unnamed Unit'} ({unit.short_name || '-'})
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
