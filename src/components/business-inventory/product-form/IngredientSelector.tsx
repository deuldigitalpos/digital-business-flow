
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ProductFormValues } from "./types";
import { ProductIngredientInput } from "@/types/business-product";
import { Input } from "@/components/ui/input";
import { X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IngredientSelectorProps {
  form: UseFormReturn<ProductFormValues>;
  ingredients: any[]; // Replace with proper type
  isEditMode?: boolean;
}

export const IngredientSelector: React.FC<IngredientSelectorProps> = ({ form, ingredients, isEditMode }) => {
  const selectedIngredients = form.watch('ingredients') || [];
  
  const handleAddIngredient = () => {
    form.setValue('ingredients', [
      ...(selectedIngredients || []),
      { ingredient_id: '', quantity: 0, cost: 0 }
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
              <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Ingredient</label>
                  <Select
                    value={ingredient.ingredient_id}
                    onValueChange={(value) => handleIngredientChange(index, 'ingredient_id', value)}
                  >
                    <SelectTrigger className="mt-1">
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
                </div>
                
                <div>
                  <label className="text-sm font-medium">Quantity</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={ingredient.quantity}
                    onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Cost</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={ingredient.cost}
                      onChange={(e) => handleIngredientChange(index, 'cost', e.target.value)}
                      className="mt-1"
                    />
                  </div>
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
