
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import { ConsumableFormValues } from './types';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategorySelectProps {
  form: UseFormReturn<ConsumableFormValues>;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({ form }) => {
  const { data: categoriesData = [], isLoading } = useBusinessCategories();
  const [open, setOpen] = React.useState(false);
  
  // Ensure categories is always a valid array
  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  
  // Make sure categories have valid IDs and filter out any invalid categories
  const validCategories = categories.filter(category => category && category.id && typeof category.id === 'string' && category.id.trim() !== '');
  
  return (
    <FormField
      control={form.control}
      name="category_id"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Category</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Loading categories..."
                  ) : field.value && validCategories.length > 0 ? (
                    validCategories.find(category => category.id === field.value)?.name || "Select a category"
                  ) : (
                    "Select a category"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search categories..." />
                <CommandEmpty>No category found.</CommandEmpty>
                {validCategories.length > 0 ? (
                  <CommandGroup>
                    {validCategories.map(category => (
                      <CommandItem
                        key={category.id}
                        value={category.name || ''}
                        onSelect={() => {
                          form.setValue("category_id", category.id);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === category.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {category.name || 'Unnamed Category'}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : (
                  <div className="py-6 text-center text-sm">
                    {isLoading ? "Loading categories..." : "No categories available."}
                  </div>
                )}
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
