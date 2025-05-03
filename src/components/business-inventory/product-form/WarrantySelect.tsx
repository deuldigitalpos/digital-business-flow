
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { useBusinessWarranties } from '@/hooks/useBusinessWarranties';
import { ProductFormValues } from './types';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WarrantySelectProps {
  form: UseFormReturn<ProductFormValues>;
}

export const WarrantySelect: React.FC<WarrantySelectProps> = ({ form }) => {
  const { warranties = [], isLoading } = useBusinessWarranties();
  const [open, setOpen] = React.useState(false);
  
  // Ensure warranties is always a valid array
  const validWarranties = React.useMemo(() => {
    if (!warranties || !Array.isArray(warranties)) return [];
    return warranties.filter(warranty => warranty && warranty.id);
  }, [warranties]);
  
  return (
    <FormField
      control={form.control}
      name="warranty_id"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Warranty</FormLabel>
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
                    "Loading warranties..."
                  ) : field.value && validWarranties.length > 0 ? (
                    validWarranties.find(warranty => warranty.id === field.value)?.name || "Select a warranty"
                  ) : (
                    "Select a warranty"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search warranties..." />
                <CommandEmpty>No warranty found.</CommandEmpty>
                {validWarranties.length > 0 && (
                  <CommandGroup>
                    {validWarranties.map(warranty => (
                      <CommandItem
                        key={warranty.id}
                        value={warranty.name || ''}
                        onSelect={() => {
                          form.setValue("warranty_id", warranty.id);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === warranty.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {warranty.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {validWarranties.length === 0 && (
                  <div className="py-6 text-center text-sm">
                    {isLoading ? "Loading warranties..." : "No warranties available."}
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
