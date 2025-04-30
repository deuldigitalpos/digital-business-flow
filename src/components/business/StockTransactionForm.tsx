
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBusinessStockMutations } from '@/hooks/useBusinessStockMutations';
import { useBusinessProducts } from '@/hooks/useBusinessProducts';
import { useBusinessIngredients } from '@/hooks/useBusinessIngredients';
import { useBusinessConsumables } from '@/hooks/useBusinessConsumables';
import { StockTransactionFormValues } from '@/types/business-stock';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ArrowUp, ArrowDown } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  item_type: z.enum(['product', 'ingredient', 'consumable'], {
    required_error: 'Item type is required',
  }),
  item_id: z.string().min(1, { message: 'Item is required' }),
  transaction_type: z.enum(['increase', 'decrease'], {
    required_error: 'Transaction type is required',
  }),
  quantity: z.coerce.number().positive({ message: 'Quantity must be greater than 0' }),
  adjustment_reason: z.string().optional(),
  reason: z.string().optional(),
});

interface StockTransactionFormProps {
  onSuccess?: () => void;
  itemType?: 'product' | 'ingredient' | 'consumable';
  itemId?: string;
  defaultTransactionType?: 'increase' | 'decrease';
}

const StockTransactionForm: React.FC<StockTransactionFormProps> = ({ 
  onSuccess, 
  itemType,
  itemId,
  defaultTransactionType = 'increase'
}) => {
  const { createStockTransaction } = useBusinessStockMutations();
  const { data: products } = useBusinessProducts();
  const { data: ingredients } = useBusinessIngredients();
  const { data: consumables } = useBusinessConsumables();
  
  const [selectedItemType, setSelectedItemType] = useState<'product' | 'ingredient' | 'consumable'>(
    itemType || 'product'
  );

  const form = useForm<StockTransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      item_type: itemType || 'product',
      item_id: itemId || '',
      transaction_type: defaultTransactionType,
      quantity: 1,
      adjustment_reason: '',
      reason: '',
    }
  });

  // Pre-select item_id if passed as prop
  useEffect(() => {
    if (itemType && itemId) {
      form.setValue('item_type', itemType);
      form.setValue('item_id', itemId);
      setSelectedItemType(itemType);
    }
  }, [itemType, itemId, form]);

  // Update available items when item type changes
  const watchItemType = form.watch('item_type');
  useEffect(() => {
    setSelectedItemType(watchItemType);
    // Reset item_id when changing item type (unless it's pre-selected)
    if (!itemId || watchItemType !== itemType) {
      form.setValue('item_id', '');
    }
  }, [watchItemType, form, itemId, itemType]);

  // Get the items based on the selected type
  const getItems = () => {
    switch (selectedItemType) {
      case 'product':
        return products || [];
      case 'ingredient':
        return ingredients || [];
      case 'consumable':
        return consumables || [];
      default:
        return [];
    }
  };

  const onSubmit = async (data: StockTransactionFormValues) => {
    try {
      await createStockTransaction.mutateAsync(data);
      form.reset({
        item_type: itemType || 'product',
        item_id: itemId || '',
        transaction_type: defaultTransactionType,
        quantity: 1,
        adjustment_reason: '',
        reason: '',
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Update Stock</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Item Type Selection (hidden if pre-selected) */}
            {!itemType && (
              <FormField
                control={form.control}
                name="item_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select item type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="ingredient">Ingredient</SelectItem>
                        <SelectItem value="consumable">Consumable</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Item Selection */}
            <FormField
              control={form.control}
              name="item_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Item</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    disabled={!!itemId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={`Select a ${selectedItemType}`} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getItems().map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Transaction Type (Increase/Decrease) */}
            <FormField
              control={form.control}
              name="transaction_type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Transaction Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="increase" id="increase" />
                        <Label htmlFor="increase" className="flex items-center gap-1 cursor-pointer">
                          <ArrowUp className="h-4 w-4 text-green-600" />
                          Increase
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="decrease" id="decrease" />
                        <Label htmlFor="decrease" className="flex items-center gap-1 cursor-pointer">
                          <ArrowDown className="h-4 w-4 text-red-600" />
                          Decrease
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Quantity */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Adjustment Reason - Changed to text field */}
            <FormField
              control={form.control}
              name="adjustment_reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adjustment Reason</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="E.g., Restock, Sale, Damage, Inventory Correction" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Notes */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter additional details about this adjustment" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full"
              disabled={createStockTransaction.isPending}
            >
              {createStockTransaction.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Update Stock'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default StockTransactionForm;
