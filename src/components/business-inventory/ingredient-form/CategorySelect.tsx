
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
import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import { IngredientFormValues } from './types';

interface CategorySelectProps {
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

export const CategorySelect: React.FC<CategorySelectProps> = ({ form }) => {
  const { data: categories = [] } = useBusinessCategories();
  
  return (
    <FormField
      control={form.control}
      name="category_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            value={field.value || undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {(categories || []).map(category => {
                // Generate a guaranteed non-empty value for each category
                const safeValue = getSafeValue(category.id, 'category', category.name);
                return (
                  <SelectItem 
                    key={safeValue}
                    value={safeValue}
                  >
                    {category.name || 'Unnamed Category'}
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
