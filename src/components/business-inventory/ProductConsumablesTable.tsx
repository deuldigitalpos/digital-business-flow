
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { ProductConsumableInput } from "@/types/business-product";
import { BusinessConsumable } from "@/hooks/useBusinessConsumables";

interface ProductConsumablesTableProps {
  consumables: ProductConsumableInput[];
  setConsumables: React.Dispatch<React.SetStateAction<ProductConsumableInput[]>>;
  allConsumables: BusinessConsumable[];
}

const ProductConsumablesTable: React.FC<ProductConsumablesTableProps> = ({
  consumables,
  setConsumables,
  allConsumables,
}) => {
  const [consumableId, setConsumableId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  
  const handleAddConsumable = () => {
    if (!consumableId || !quantity) return;
    
    const selectedConsumable = allConsumables.find(item => item.id === consumableId);
    if (!selectedConsumable) return;
    
    const numQuantity = parseFloat(quantity);
    
    // Calculate cost based on quantity and average cost
    const averageCost = selectedConsumable.average_cost || 0;
    const calculatedCost = (averageCost * numQuantity);
    
    const newConsumable: ProductConsumableInput = {
      consumable_id: consumableId,
      quantity: numQuantity,
      cost: parseFloat(calculatedCost.toFixed(2))
    };
    
    setConsumables([...consumables, newConsumable]);
    
    // Reset form
    setConsumableId("");
    setQuantity("1");
  };
  
  const handleRemoveConsumable = (index: number) => {
    const newConsumables = [...consumables];
    newConsumables.splice(index, 1);
    setConsumables(newConsumables);
  };
  
  const handleQuantityChange = (index: number, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return;
    
    const newConsumables = [...consumables];
    const consumable = newConsumables[index];
    const selectedConsumable = allConsumables.find(item => item.id === consumable.consumable_id);
    
    if (selectedConsumable) {
      const averageCost = selectedConsumable.average_cost || 0;
      const calculatedCost = (averageCost * numValue);
      
      newConsumables[index] = {
        ...consumable,
        quantity: numValue,
        cost: parseFloat(calculatedCost.toFixed(2))
      };
      
      setConsumables(newConsumables);
    }
  };
  
  const getConsumableNameById = (id: string) => {
    const consumable = allConsumables.find(item => item.id === id);
    return consumable ? consumable.name : 'Unknown';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        <div className="md:col-span-7">
          <label className="text-sm font-medium mb-1 block">Consumable</label>
          <Select value={consumableId} onValueChange={setConsumableId}>
            <SelectTrigger>
              <SelectValue placeholder="Select consumable" />
            </SelectTrigger>
            <SelectContent>
              {allConsumables.map((consumable) => (
                <SelectItem key={consumable.id} value={consumable.id}>
                  {consumable.name} (${consumable.average_cost?.toFixed(2) || '0.00'}/unit)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-3">
          <label className="text-sm font-medium mb-1 block">Quantity</label>
          <Input
            type="number"
            step="0.01"
            min="0.01"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        
        <div className="md:col-span-2">
          <Button type="button" onClick={handleAddConsumable} className="w-full">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </div>
      
      {consumables.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Consumable</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consumables.map((consumable, index) => (
                <TableRow key={index}>
                  <TableCell>{getConsumableNameById(consumable.consumable_id)}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={consumable.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      className="h-8 w-20"
                    />
                  </TableCell>
                  <TableCell className="text-right">${consumable.cost.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveConsumable(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} className="text-right font-medium">Total:</TableCell>
                <TableCell className="text-right font-medium">
                  ${consumables.reduce((sum, item) => sum + item.cost, 0).toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No consumables added yet.</p>
      )}
    </div>
  );
};

export default ProductConsumablesTable;
