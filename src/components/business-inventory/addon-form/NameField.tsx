
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AddonFormValues } from './types';

interface NameFieldProps {
  form: UseFormReturn<AddonFormValues>;
}

export const NameField: React.FC<NameFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input placeholder="Enter add-on name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
