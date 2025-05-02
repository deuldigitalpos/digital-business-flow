
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { ProductSizeInput } from "@/types/business-product";

interface ProductSizesTableProps {
  sizes: ProductSizeInput[];
  setSizes: React.Dispatch<React.SetStateAction<ProductSizeInput[]>>;
  basePrice: number;
}

const ProductSizesTable: React.FC<ProductSizesTableProps> = ({
  sizes,
  setSizes,
  basePrice = 0,
}) => {
  const [sizeName, setSizeName] = useState<string>("");
  const [additionalPrice, setAdditionalPrice] = useState<string>("0");
  
  const handleAddSize = () => {
    if (!sizeName) return;
    
    const numAdditionalPrice = parseFloat(additionalPrice) || 0;
    
    const newSize: ProductSizeInput = {
      name: sizeName,
      additional_price: numAdditionalPrice
    };
    
    setSizes([...sizes, newSize]);
    
    // Reset form
    setSizeName("");
    setAdditionalPrice("0");
  };
  
  const handleRemoveSize = (index: number) => {
    const newSizes = [...sizes];
    newSizes.splice(index, 1);
    setSizes(newSizes);
  };
  
  const handleNameChange = (index: number, value: string) => {
    const newSizes = [...sizes];
    newSizes[index] = {
      ...newSizes[index],
      name: value
    };
    setSizes(newSizes);
  };
  
  const handlePriceChange = (index: number, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    const newSizes = [...sizes];
    newSizes[index] = {
      ...newSizes[index],
      additional_price: numValue
    };
    setSizes(newSizes);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-end">
        <div className="md:col-span-3">
          <label className="text-sm font-medium mb-1 block">Size Name</label>
          <Input
            placeholder="e.g. Small, Medium, Large"
            value={sizeName}
            onChange={(e) => setSizeName(e.target.value)}
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="text-sm font-medium mb-1 block">Additional Price</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={additionalPrice}
            onChange={(e) => setAdditionalPrice(e.target.value)}
          />
        </div>
        
        <div className="md:col-span-2">
          <Button type="button" onClick={handleAddSize} className="w-full">
            <Plus className="h-4 w-4 mr-1" /> Add Size
          </Button>
        </div>
      </div>
      
      {sizes.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Size Name</TableHead>
                <TableHead>Additional Price</TableHead>
                <TableHead className="text-right">Total Price</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sizes.map((size, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      value={size.name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={size.additional_price}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                      className="h-8 w-24"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    ${(basePrice + size.additional_price).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSize(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No sizes added yet.</p>
      )}
    </div>
  );
};

export default ProductSizesTable;
