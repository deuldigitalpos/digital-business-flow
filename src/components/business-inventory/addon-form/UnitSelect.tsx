
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

interface UnitSelectProps {
  form: UseFormReturn<any>;
}

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
              {units.map(unit => (
                <SelectItem
                  key={unit.id}
                  value={unit.id}
                >
                  {unit.name} ({unit.short_name})
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
