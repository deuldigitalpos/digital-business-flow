
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ProductFormValues } from "./product-form/types";
import { ProductSizeInput } from "@/types/business-product";
import { Input } from "@/components/ui/input";
import { X, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface SizeManagerProps {
  form: UseFormReturn<ProductFormValues>;
  isEditMode?: boolean;
}

export const SizeManager: React.FC<SizeManagerProps> = ({ form, isEditMode }) => {
  const sizes = form.watch('sizes') || [];
  
  const handleAddSize = () => {
    form.setValue('sizes', [
      ...(sizes || []),
      { name: '', additional_price: 0 }
    ]);
    form.setValue('has_sizes', true);
  };

  const handleRemoveSize = (index: number) => {
    const newSizes = [...sizes];
    newSizes.splice(index, 1);
    form.setValue('sizes', newSizes);
    if (newSizes.length === 0) {
      form.setValue('has_sizes', false);
    }
  };

  const handleSizeChange = (index: number, field: keyof ProductSizeInput, value: string | number) => {
    const newSizes = [...sizes];
    newSizes[index] = {
      ...newSizes[index],
      [field]: field === 'additional_price' ? Number(value) : value
    };
    form.setValue('sizes', newSizes);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Product Sizes</h3>
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleAddSize}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Size
        </Button>
      </div>
      
      {sizes.length > 0 ? (
        <div className="space-y-3">
          {sizes.map((size, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`size-name-${index}`} className="text-sm font-medium mb-2 block">
                    Size Name
                  </Label>
                  <Input
                    id={`size-name-${index}`}
                    placeholder="Size Name"
                    value={size.name}
                    onChange={(e) => handleSizeChange(index, 'name', e.target.value)}
                  />
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <Label htmlFor={`size-price-${index}`} className="text-sm font-medium mb-2 block">
                      Additional Price
                    </Label>
                    <Input
                      id={`size-price-${index}`}
                      type="number"
                      placeholder="0.00"
                      value={size.additional_price}
                      onChange={(e) => handleSizeChange(index, 'additional_price', e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="mt-7"
                    onClick={() => handleRemoveSize(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 border border-dashed rounded-md">
          <p className="text-muted-foreground mb-3">No sizes added yet</p>
          <Button type="button" variant="secondary" onClick={handleAddSize}>
            <Plus className="mr-2 h-4 w-4" /> Add Your First Size
          </Button>
        </div>
      )}
    </div>
  );
};
