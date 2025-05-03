
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBusinessUnits } from '@/hooks/useBusinessUnits';
import { IngredientFormValues } from './types';

interface UnitSelectProps {
  form: UseFormReturn<IngredientFormValues>;
}

export const UnitSelect: React.FC<UnitSelectProps> = ({ form }) => {
  const { data: units = [], isLoading } = useBusinessUnits();
  const [open, setOpen] = React.useState(false);
  
  // Ensure we have a valid array of units
  const validUnits = Array.isArray(units) ? units.filter(unit => unit && unit.id) : [];
  
  return (
    <FormField
      control={form.control}
      name="unit_id"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Unit</FormLabel>
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
                    "Loading units..."
                  ) : field.value && validUnits.length > 0 ? (
                    validUnits.find(unit => unit.id === field.value)?.name || "Select a unit"
                  ) : (
                    "Select a unit"
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search units..." />
                <CommandEmpty>No unit found.</CommandEmpty>
                {validUnits.length > 0 ? (
                  <CommandGroup>
                    {validUnits.map(unit => (
                      <CommandItem
                        key={unit.id}
                        value={unit.name || ''}
                        onSelect={() => {
                          form.setValue("unit_id", unit.id);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === unit.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {unit.name} ({unit.short_name || ''})
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : (
                  <div className="py-6 text-center text-sm">
                    {isLoading ? "Loading units..." : "No units available."}
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
