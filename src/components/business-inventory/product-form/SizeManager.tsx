
import React from 'react';
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ProductFormValues } from "./types";
import { ProductSizeInput } from "@/types/business-product";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
        <Button type="button" variant="outline" onClick={handleAddSize}>
          Add Size
        </Button>
      </div>
      
      {sizes.length > 0 ? (
        <div className="space-y-2">
          {sizes.map((size, index) => (
            <Card key={index}>
              <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem>
                  <FormLabel>Size Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Size Name"
                      value={size.name}
                      onChange={(e) => handleSizeChange(index, 'name', e.target.value)}
                    />
                  </FormControl>
                </FormItem>
                
                <div className="flex items-center gap-2">
                  <FormItem className="flex-1">
                    <FormLabel>Additional Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={size.additional_price}
                        onChange={(e) => handleSizeChange(index, 'additional_price', e.target.value)}
                      />
                    </FormControl>
                  </FormItem>
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
        <div className="text-center p-4 border border-dashed rounded-md">
          <p className="text-muted-foreground">No sizes added yet</p>
        </div>
      )}
    </div>
  );
};
