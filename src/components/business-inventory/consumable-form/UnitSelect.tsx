
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { useBusinessUnits } from '@/hooks/useBusinessUnits';
import { ConsumableFormValues } from './types';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnitSelectProps {
  form: UseFormReturn<ConsumableFormValues>;
}

export const UnitSelect: React.FC<UnitSelectProps> = ({ form }) => {
  const { data: unitsData = [], isLoading } = useBusinessUnits();
  const [open, setOpen] = React.useState(false);
  
  // Ensure units is always a valid array
  const units = Array.isArray(unitsData) ? unitsData : [];
  
  // Make sure units have valid IDs and filter out any invalid units
  const validUnits = units.filter(unit => unit && unit.id && typeof unit.id === 'string' && unit.id.trim() !== '');
  
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
              {/* Wrap Command in a proper error boundary to handle potential issues */}
              <div className="command-wrapper">
                <Command>
                  <CommandInput placeholder="Search units..." />
                  <CommandEmpty>No unit found.</CommandEmpty>
                  {validUnits && validUnits.length > 0 ? (
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
              </div>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
