
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ProductFormValues } from "./types";
import { ProductConsumableInput } from "@/types/business-product";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ConsumableSelectorProps {
  form: UseFormReturn<ProductFormValues>;
  consumables: any[]; // Replace with proper type
  isEditMode?: boolean;
}

export const ConsumableSelector: React.FC<ConsumableSelectorProps> = ({ form, consumables, isEditMode }) => {
  const selectedConsumables = form.watch('consumables') || [];
  
  const handleAddConsumable = () => {
    form.setValue('consumables', [
      ...(selectedConsumables || []),
      { consumable_id: '', quantity: 0, cost: 0 }
    ]);
    form.setValue('has_consumables', true);
  };

  const handleRemoveConsumable = (index: number) => {
    const newConsumables = [...selectedConsumables];
    newConsumables.splice(index, 1);
    form.setValue('consumables', newConsumables);
    if (newConsumables.length === 0) {
      form.setValue('has_consumables', false);
    }
  };

  const handleConsumableChange = (index: number, field: keyof ProductConsumableInput, value: string | number) => {
    const newConsumables = [...selectedConsumables];
    newConsumables[index] = {
      ...newConsumables[index],
      [field]: field === 'quantity' || field === 'cost' ? Number(value) : value
    };
    form.setValue('consumables', newConsumables);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Product Consumables</h3>
        <Button type="button" variant="outline" onClick={handleAddConsumable}>
          Add Consumable
        </Button>
      </div>
      
      {selectedConsumables.length > 0 ? (
        <div className="space-y-2">
          {selectedConsumables.map((consumable, index) => (
            <Card key={index}>
              <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormItem>
                  <FormLabel>Consumable</FormLabel>
                  <Select
                    value={consumable.consumable_id}
                    onValueChange={(value) => handleConsumableChange(index, 'consumable_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Consumable" />
                    </SelectTrigger>
                    <SelectContent>
                      {consumables.map((cons) => (
                        <SelectItem key={cons.id} value={cons.id}>
                          {cons.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
                
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={consumable.quantity}
                    onChange={(e) => handleConsumableChange(index, 'quantity', e.target.value)}
                  />
                </FormItem>
                
                <div className="flex items-center gap-2">
                  <FormItem className="flex-1">
                    <FormLabel>Cost</FormLabel>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={consumable.cost}
                      onChange={(e) => handleConsumableChange(index, 'cost', e.target.value)}
                    />
                  </FormItem>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="mt-7"
                    onClick={() => handleRemoveConsumable(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 border border-dashed rounded-md">
          <p className="text-muted-foreground">No consumables added yet</p>
        </div>
      )}
    </div>
  );
};
