
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ProductFormValues } from "./types";
import { ProductIngredientInput } from "@/types/business-product";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBusinessUnits } from '@/hooks/useBusinessUnits';

interface IngredientSelectorProps {
  form: UseFormReturn<ProductFormValues>;
  ingredients: any[]; // Replace with proper type
  isEditMode?: boolean;
}

export const IngredientSelector: React.FC<IngredientSelectorProps> = ({ form, ingredients, isEditMode }) => {
  const { data: units } = useBusinessUnits();
  const selectedIngredients = form.watch('ingredients') || [];
  
  const handleAddIngredient = () => {
    form.setValue('ingredients', [
      ...(selectedIngredients || []),
      { ingredient_id: '', quantity: 0, unit_id: '', cost: 0 }
    ]);
    form.setValue('has_ingredients', true);
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = [...selectedIngredients];
    newIngredients.splice(index, 1);
    form.setValue('ingredients', newIngredients);
    if (newIngredients.length === 0) {
      form.setValue('has_ingredients', false);
    }
  };

  const handleIngredientChange = (index: number, field: keyof ProductIngredientInput, value: string | number) => {
    const newIngredients = [...selectedIngredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: field === 'quantity' || field === 'cost' ? Number(value) : value
    };
    form.setValue('ingredients', newIngredients);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Product Ingredients</h3>
        <Button type="button" variant="outline" onClick={handleAddIngredient}>
          Add Ingredient
        </Button>
      </div>
      
      {selectedIngredients.length > 0 ? (
        <div className="space-y-2">
          {selectedIngredients.map((ingredient, index) => (
            <Card key={index}>
              <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormItem>
                  <FormLabel>Ingredient</FormLabel>
                  <Select
                    value={ingredient.ingredient_id}
                    onValueChange={(value) => handleIngredientChange(index, 'ingredient_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Ingredient" />
                    </SelectTrigger>
                    <SelectContent>
                      {ingredients.map((ing) => (
                        <SelectItem key={ing.id} value={ing.id}>
                          {ing.name}
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
                    value={ingredient.quantity}
                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                  />
                </FormItem>
                
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <Select
                    value={ingredient.unit_id}
                    onValueChange={(value) => handleIngredientChange(index, 'unit_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {units?.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id}>
                          {unit.name} ({unit.short_name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
                
                <div className="flex items-center gap-2">
                  <FormItem className="flex-1">
                    <FormLabel>Cost</FormLabel>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={ingredient.cost}
                      onChange={(e) => handleIngredientChange(index, 'cost', e.target.value)}
                    />
                  </FormItem>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="mt-7"
                    onClick={() => handleRemoveIngredient(index)}
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
          <p className="text-muted-foreground">No ingredients added yet</p>
        </div>
      )}
    </div>
  );
};
