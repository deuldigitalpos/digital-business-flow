
import React from 'react';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Minus } from 'lucide-react';
import { ModifierItem } from '@/types/business-product';

interface ModifierItemFormProps {
  index: number;
  value: ModifierItem;
  onChange: (index: number, value: ModifierItem) => void;
  onRemove: (index: number) => void;
  isRemovable: boolean;
}

const ModifierItemForm: React.FC<ModifierItemFormProps> = ({
  index,
  value,
  onChange,
  onRemove,
  isRemovable
}) => {
  return (
    <div className="border p-4 rounded-lg mb-4">
      <div className="flex justify-between items-center mb-4">
        <div className="w-3/4">
          <FormItem>
            <FormLabel>Modifier Name</FormLabel>
            <FormControl>
              <Input
                value={value.name}
                onChange={(e) => 
                  onChange(index, { ...value, name: e.target.value })
                }
                placeholder="e.g., Extra cheese, Spicy level"
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
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <FormItem>
          <FormLabel>Regular Price</FormLabel>
          <FormControl>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={value.size_regular_price || ''}
              onChange={(e) => 
                onChange(index, { ...value, size_regular_price: parseFloat(e.target.value) || 0 })
              }
            />
          </FormControl>
        </FormItem>
        
        <FormItem>
          <FormLabel>Medium Price</FormLabel>
          <FormControl>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={value.size_medium_price || ''}
              onChange={(e) => 
                onChange(index, { 
                  ...value, 
                  size_medium_price: e.target.value ? parseFloat(e.target.value) : null 
                })
              }
              placeholder="Optional"
            />
          </FormControl>
        </FormItem>
        
        <FormItem>
          <FormLabel>Large Price</FormLabel>
          <FormControl>
            <Input
              type="number"
              min="0" 
              step="0.01"
              value={value.size_large_price || ''}
              onChange={(e) => 
                onChange(index, { 
                  ...value, 
                  size_large_price: e.target.value ? parseFloat(e.target.value) : null 
                })
              }
              placeholder="Optional"
            />
          </FormControl>
        </FormItem>
        
        <FormItem>
          <FormLabel>Extra Large Price</FormLabel>
          <FormControl>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={value.size_xl_price || ''}
              onChange={(e) => 
                onChange(index, { 
                  ...value, 
                  size_xl_price: e.target.value ? parseFloat(e.target.value) : null 
                })
              }
              placeholder="Optional"
            />
          </FormControl>
        </FormItem>
      </div>
    </div>
  );
};

export default ModifierItemForm;
