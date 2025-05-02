
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
import { ProductIngredientInput } from "@/types/business-product";
import { BusinessIngredient } from "@/hooks/useBusinessIngredients";
import { BusinessUnit } from "@/types/business-unit";

interface ProductIngredientsTableProps {
  ingredients: ProductIngredientInput[];
  setIngredients: React.Dispatch<React.SetStateAction<ProductIngredientInput[]>>;
  allIngredients: BusinessIngredient[];
  units: BusinessUnit[];
}

const ProductIngredientsTable: React.FC<ProductIngredientsTableProps> = ({
  ingredients,
  setIngredients,
  allIngredients,
  units,
}) => {
  const [ingredientId, setIngredientId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");
  const [unitId, setUnitId] = useState<string>("");
  
  const handleAddIngredient = () => {
    if (!ingredientId || !quantity || !unitId) return;
    
    const selectedIngredient = allIngredients.find(item => item.id === ingredientId);
    if (!selectedIngredient) return;
    
    const numQuantity = parseFloat(quantity);
    
    // Calculate cost based on quantity and average cost
    const averageCost = selectedIngredient.average_cost || 0;
    const calculatedCost = (averageCost * numQuantity);
    
    const newIngredient: ProductIngredientInput = {
      ingredient_id: ingredientId,
      quantity: numQuantity,
      unit_id: unitId,
      cost: parseFloat(calculatedCost.toFixed(2))
    };
    
    setIngredients([...ingredients, newIngredient]);
    
    // Reset form
    setIngredientId("");
    setQuantity("1");
    setUnitId("");
  };
  
  const handleRemoveIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };
  
  const handleQuantityChange = (index: number, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return;
    
    const newIngredients = [...ingredients];
    const ingredient = newIngredients[index];
    const selectedIngredient = allIngredients.find(item => item.id === ingredient.ingredient_id);
    
    if (selectedIngredient) {
      const averageCost = selectedIngredient.average_cost || 0;
      const calculatedCost = (averageCost * numValue);
      
      newIngredients[index] = {
        ...ingredient,
        quantity: numValue,
        cost: parseFloat(calculatedCost.toFixed(2))
      };
      
      setIngredients(newIngredients);
    }
  };
  
  const getIngredientNameById = (id: string) => {
    const ingredient = allIngredients.find(item => item.id === id);
    return ingredient ? ingredient.name : 'Unknown';
  };
  
  const getUnitNameById = (id: string) => {
    const unit = units.find(item => item.id === id);
    return unit ? unit.short_name : 'Unit';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        <div className="md:col-span-5">
          <label className="text-sm font-medium mb-1 block">Ingredient</label>
          <Select value={ingredientId} onValueChange={setIngredientId}>
            <SelectTrigger>
              <SelectValue placeholder="Select ingredient" />
            </SelectTrigger>
            <SelectContent>
              {allIngredients.map((ingredient) => (
                <SelectItem key={ingredient.id} value={ingredient.id}>
                  {ingredient.name} (${ingredient.average_cost?.toFixed(2) || '0.00'}/unit)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-2">
          <label className="text-sm font-medium mb-1 block">Quantity</label>
          <Input
            type="number"
            step="0.01"
            min="0.01"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        
        <div className="md:col-span-3">
          <label className="text-sm font-medium mb-1 block">Unit</label>
          <Select value={unitId} onValueChange={setUnitId}>
            <SelectTrigger>
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.name} ({unit.short_name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-2">
          <Button type="button" onClick={handleAddIngredient} className="w-full">
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </div>
      
      {ingredients.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingredient</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredients.map((ingredient, index) => (
                <TableRow key={index}>
                  <TableCell>{getIngredientNameById(ingredient.ingredient_id)}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={ingredient.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      className="h-8 w-20"
                    />
                  </TableCell>
                  <TableCell>{getUnitNameById(ingredient.unit_id)}</TableCell>
                  <TableCell className="text-right">${ingredient.cost.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveIngredient(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">Total:</TableCell>
                <TableCell className="text-right font-medium">
                  ${ingredients.reduce((sum, item) => sum + item.cost, 0).toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No ingredients added yet.</p>
      )}
    </div>
  );
};

export default ProductIngredientsTable;
