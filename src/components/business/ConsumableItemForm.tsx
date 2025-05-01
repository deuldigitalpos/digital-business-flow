
import React, { useState, useEffect } from 'react';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Minus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBusinessConsumables } from '@/hooks/useBusinessConsumables';
import { useBusinessUnits } from '@/hooks/useBusinessUnits';
import { ConsumableItem } from '@/types/business-product';

interface ConsumableItemFormProps {
  index: number;
  value: ConsumableItem;
  onChange: (index: number, value: ConsumableItem) => void;
  onRemove: (index: number) => void;
  isRemovable: boolean;
}

const ConsumableItemForm: React.FC<ConsumableItemFormProps> = ({
  index,
  value,
  onChange,
  onRemove,
  isRemovable
}) => {
  const { data: consumables = [] } = useBusinessConsumables();
  const { data: units = [] } = useBusinessUnits();
  const [selectedConsumable, setSelectedConsumable] = useState<any>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [conversionFactor, setConversionFactor] = useState(1);

  // Find the selected consumable
  useEffect(() => {
    if (value.consumable_id) {
      const consumable = consumables.find(c => c.id === value.consumable_id);
      setSelectedConsumable(consumable || null);
      
      // If the consumable has a default unit, select it
      if (consumable?.unit_id) {
        onChange(index, { ...value, unit_id: consumable.unit_id });
        setSelectedUnit(consumable.unit_id);
      }
    }
  }, [value.consumable_id, consumables]);

  // Calculate cost whenever consumable, quantity, or unit changes
  useEffect(() => {
    if (selectedConsumable && value.quantity) {
      // Base calculation on consumable unit price and quantity
      let calculatedCost = selectedConsumable.unit_price * value.quantity * conversionFactor;
      
      // Update the cost in the parent component
      onChange(index, { ...value, cost: parseFloat(calculatedCost.toFixed(2)) });
    }
  }, [selectedConsumable, value.quantity, conversionFactor]);

  // Handle unit conversion
  const handleUnitChange = (unitId: string) => {
    setSelectedUnit(unitId);
    
    // Get the original and new unit
    const originalUnit = units.find(u => u.id === selectedConsumable?.unit_id);
    const newUnit = units.find(u => u.id === unitId);
    
    // Set default conversion factor
    let factor = 1;
    
    // Simple conversion logic example (would need to be expanded for real use)
    if (originalUnit && newUnit) {
      // Example: kg to g conversion
      if (originalUnit.short_name === 'kg' && newUnit.short_name === 'g') {
        factor = 0.001; // 1g = 0.001kg for cost calculation
      }
      // Example: g to kg conversion
      else if (originalUnit.short_name === 'g' && newUnit.short_name === 'kg') {
        factor = 1000; // 1kg = 1000g for cost calculation
      }
      // Add more conversion logic as needed
    }
    
    setConversionFactor(factor);
    onChange(index, { ...value, unit_id: unitId });
  };

  return (
    <div className="flex items-end gap-4">
      <div className="w-1/3">
        <FormItem>
          <FormLabel>Consumable</FormLabel>
          <Select
            value={value.consumable_id || undefined}
            onValueChange={(consumableId) => 
              onChange(index, { ...value, consumable_id: consumableId })
            }
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select consumable" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {consumables.map((consumable) => (
                <SelectItem key={consumable.id} value={consumable.id}>
                  {consumable.name} - {consumable.unit_price} per unit ({consumable.quantity_available} available)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      </div>
      
      <div className="w-1/6">
        <FormItem>
          <FormLabel>Quantity</FormLabel>
          <FormControl>
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={value.quantity || ''}
              onChange={(e) => 
                onChange(index, { ...value, quantity: parseFloat(e.target.value) || 0 })
              }
            />
          </FormControl>
        </FormItem>
      </div>
      
      <div className="w-1/4">
        <FormItem>
          <FormLabel>Unit</FormLabel>
          <Select
            value={value.unit_id || undefined}
            onValueChange={handleUnitChange}
            disabled={!selectedConsumable}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.name} ({unit.short_name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      </div>
      
      <div className="w-1/6">
        <FormItem>
          <FormLabel>Cost</FormLabel>
          <FormControl>
            <Input
              readOnly
              value={value.cost?.toFixed(2) || '0.00'}
            />
          </FormControl>
        </FormItem>
      </div>
      
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onRemove(index)}
        disabled={!isRemovable}
        className="mb-2"
      >
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ConsumableItemForm;
