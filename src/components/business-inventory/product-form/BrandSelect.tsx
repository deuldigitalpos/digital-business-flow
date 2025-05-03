
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { useBusinessBrands } from '@/hooks/useBusinessBrands';
import { ProductFormValues } from './types';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandSelectProps {
  form: UseFormReturn<ProductFormValues>;
}

export const BrandSelect: React.FC<BrandSelectProps> = ({ form }) => {
  const { brands = [], isLoading } = useBusinessBrands();
  const [open, setOpen] = React.useState(false);
  
  // Ensure brands is always a valid array
  const validBrands = React.useMemo(() => {
    if (!brands || !Array.isArray(brands)) return [];
    return brands.filter(brand => brand && brand.id);
  }, [brands]);
  
  return (
    <FormField
      control={form.control}
      name="brand_id"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Brand</FormLabel>
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
                    "Loading brands..."
                  ) : field.value && validBrands.length > 0 ? (
                    validBrands.find(brand => brand.id === field.value)?.name || "Select a brand"
                  ) : (
                    "Select a brand"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search brands..." />
                <CommandEmpty>No brand found.</CommandEmpty>
                {validBrands.length > 0 ? (
                  <CommandGroup>
                    {validBrands.map(brand => (
                      <CommandItem
                        key={brand.id}
                        value={brand.name || ''}
                        onSelect={() => {
                          form.setValue("brand_id", brand.id);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === brand.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {brand.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : (
                  <div className="py-6 text-center text-sm">
                    {isLoading ? "Loading brands..." : "No brands available."}
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
