import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { useBusinessStockMutations } from '@/hooks/useBusinessStockMutations';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import { useBusinessSuppliers } from '@/hooks/useBusinessSuppliers';
import { useBusinessConsumables } from '@/hooks/useBusinessConsumables';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface AddStockTransactionFormProps {
  onClose: () => void;
  defaultTransactionType?: 'consumable' | 'ingredient' | 'addon' | 'product';
}

// Define types for status options
type TransactionType = 'consumable' | 'ingredient' | 'addon' | 'product';
type TransactionStatus = 'delivered' | 'ordered' | 'damaged' | 'returned';
type PaymentStatus = 'paid' | 'unpaid' | 'partial' | 'refunded';

const formSchema = z.object({
  category_id: z.string().optional(),
  transaction_type: z.enum(['consumable', 'ingredient', 'addon', 'product']),
  item_id: z.string(),
  supplier_id: z.string().optional(),
  quantity: z.number(),
  direction: z.enum(['increase', 'decrease']),
  cost_per_unit: z.number().min(0),
  total_cost: z.number().min(0),
  status: z.enum(['delivered', 'ordered', 'damaged', 'returned']),
  payment_status: z.enum(['paid', 'unpaid', 'partial', 'refunded']),
  discount: z.number().min(0).default(0),
  paid_amount: z.number().min(0).optional(),
  due_date: z.date().optional(),
  expiration_date: z.date().optional(),
  notes: z.string().optional(),
  reference_id: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const transactionTypes = [
  { value: 'consumable', label: 'Consumable' },
  { value: 'ingredient', label: 'Raw Ingredient' },
  { value: 'addon', label: 'Add-on' },
  { value: 'product', label: 'Product' }
];

const statusOptions = [
  { value: 'delivered', label: 'Delivered' },
  { value: 'ordered', label: 'Ordered' },
  { value: 'damaged', label: 'Damaged' },
  { value: 'returned', label: 'Returned' }
];

const paymentStatusOptions = [
  { value: 'paid', label: 'Paid' },
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'partial', label: 'Partial' },
  { value: 'refunded', label: 'Refunded' }
];

// Define a type for stock transaction
interface StockTransaction {
  transaction_type: 'consumable' | 'ingredient' | 'addon' | 'product';
  item_id: string;
  supplier_id: string | null;
  transaction_date: string;
  quantity: number;
  cost_per_unit: number;
  total_cost: number;
  status: 'delivered' | 'ordered' | 'damaged' | 'returned';
  payment_status: 'paid' | 'unpaid' | 'partial' | 'refunded';
  discount: number;
  paid_amount: number;
  unpaid_amount: number;
  due_date: string | null;
  expiration_date: string | null;
  notes: string | null;
  reference_id: string | null;
  created_by: string | null;
}

// Helper function to ensure we never have empty string values for IDs
const getSafeValue = (value: string | null | undefined, prefix: string, name: string | null | undefined): string => {
  // If we have a valid ID and it's not an empty string, use it
  if (value && value.trim() !== '') return value;
  
  // Generate a unique, non-empty fallback value using sanitized name or default
  const safeName = name && name.trim() !== '' ? name.trim() : 'unnamed';
  return `${prefix}-${safeName}-${Math.random().toString(36).substring(2, 9)}`;
};

const AddStockTransactionForm: React.FC<AddStockTransactionFormProps> = ({ 
  onClose,
  defaultTransactionType = 'consumable'
}) => {
  const { businessUser } = useBusinessAuth();
  const { createStockTransaction } = useBusinessStockMutations();
  const { data: categories = [] } = useBusinessCategories();
  const { suppliers = [] } = useBusinessSuppliers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { consumables = [] } = useBusinessConsumables();

  // Hold all items of various types
  const [allItems, setAllItems] = useState<{
    consumables: any[];
    ingredients: any[];
    addons: any[];
    products: any[];
  }>({
    consumables: [],
    ingredients: [],
    addons: [],
    products: []
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transaction_type: defaultTransactionType,
      category_id: '',
      item_id: '',
      supplier_id: '',
      quantity: 0,
      direction: 'increase',
      cost_per_unit: 0,
      total_cost: 0,
      status: 'delivered',
      payment_status: 'paid',
      discount: 0,
      paid_amount: 0,
      due_date: undefined,
      expiration_date: undefined,
      notes: '',
      reference_id: ''
    }
  });

  const transactionType = form.watch('transaction_type');
  const quantity = form.watch('quantity');
  const direction = form.watch('direction');
  const costPerUnit = form.watch('cost_per_unit');
  const discount = form.watch('discount');
  const paymentStatus = form.watch('payment_status');

  // Effect to update total cost when quantity or cost per unit changes
  useEffect(() => {
    const total = quantity * costPerUnit;
    form.setValue('total_cost', total);
  }, [quantity, costPerUnit, form]);

  // Effect to update paid amount when payment status or total cost changes
  useEffect(() => {
    const totalCost = form.getValues('total_cost');
    const discountValue = form.getValues('discount') || 0;
    const finalCost = Math.max(0, totalCost - discountValue);
    
    if (paymentStatus === 'paid') {
      form.setValue('paid_amount', finalCost);
    } else if (paymentStatus === 'unpaid') {
      form.setValue('paid_amount', 0);
    }
    // For 'partial' we let the user decide the amount
  }, [paymentStatus, form.getValues('total_cost'), discount, form]);

  // Load items based on transaction type
  useEffect(() => {
    const fetchItems = async () => {
      if (!businessUser?.business_id) return;
      
      try {
        if (transactionType === 'consumable') {
          // If consumables are already loaded, use them
          if (consumables && consumables.length > 0) {
            setAllItems(prev => ({ ...prev, consumables }));
            setFilteredItems(consumables);
            return;
          }
          
          const { data, error } = await supabase
            .from('business_consumables')
            .select('*')
            .eq('business_id', businessUser.business_id);
            
          if (error) throw error;
          setAllItems(prev => ({ ...prev, consumables: data }));
          setFilteredItems(data);
        }
        else if (transactionType === 'ingredient') {
          const { data, error } = await supabase
            .from('business_ingredients')
            .select('*')
            .eq('business_id', businessUser.business_id);
            
          if (error) throw error;
          setAllItems(prev => ({ ...prev, ingredients: data }));
          setFilteredItems(data);
        }
        else if (transactionType === 'addon') {
          const { data, error } = await supabase
            .from('business_addons')
            .select('*')
            .eq('business_id', businessUser.business_id);
            
          if (error) throw error;
          setAllItems(prev => ({ ...prev, addons: data }));
          setFilteredItems(data);
        }
        else if (transactionType === 'product') {
          const { data, error } = await supabase
            .from('business_products')
            .select('*')
            .eq('business_id', businessUser.business_id);
            
          if (error) throw error;
          setAllItems(prev => ({ ...prev, products: data }));
          setFilteredItems(data);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    
    fetchItems();
  }, [transactionType, businessUser?.business_id, consumables]);

  // Handle category selection filtering
  useEffect(() => {
    if (!selectedCategory) {
      // If no category selected, show all items of current type
      switch (transactionType) {
        case 'consumable':
          setFilteredItems(allItems.consumables);
          break;
        case 'ingredient':
          setFilteredItems(allItems.ingredients);
          break;
        case 'addon':
          setFilteredItems(allItems.addons);
          break;
        case 'product':
          setFilteredItems(allItems.products);
          break;
      }
      return;
    }
    
    // Otherwise filter by category
    switch (transactionType) {
      case 'consumable':
        setFilteredItems(allItems.consumables.filter(item => item.category_id === selectedCategory));
        break;
      case 'ingredient':
        setFilteredItems(allItems.ingredients.filter(item => item.category_id === selectedCategory));
        break;
      case 'addon':
        setFilteredItems(allItems.addons.filter(item => item.category_id === selectedCategory));
        break;
      case 'product':
        setFilteredItems(allItems.products.filter(item => item.category_id === selectedCategory));
        break;
    }
  }, [selectedCategory, transactionType, allItems]);

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId || null);
    form.setValue('category_id', categoryId);
    form.setValue('item_id', '');
  };

  // Handle item selection
  const handleItemChange = (itemId: string) => {
    form.setValue('item_id', itemId);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Adjust quantity based on direction
      const adjustedQuantity = data.direction === 'increase' ? data.quantity : -data.quantity;
      
      // Calculate unpaid amount
      const discountValue = data.discount || 0;
      const paidAmount = data.paid_amount || 0;
      const unpaidAmount = Math.max(0, (data.total_cost - discountValue) - paidAmount);
      
      await createStockTransaction.mutateAsync({
        transaction_type: data.transaction_type,
        item_id: data.item_id,
        supplier_id: data.supplier_id || null,
        transaction_date: new Date().toISOString(),
        quantity: adjustedQuantity,
        cost_per_unit: data.cost_per_unit,
        total_cost: data.total_cost,
        status: data.status,
        payment_status: data.payment_status,
        discount: data.discount,
        paid_amount: data.paid_amount || 0,
        unpaid_amount: unpaidAmount,
        due_date: data.due_date ? data.due_date.toISOString() : null,
        expiration_date: data.expiration_date ? data.expiration_date.toISOString() : null,
        notes: data.notes || null,
        reference_id: data.reference_id || null,
        created_by: businessUser?.id || null
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[700px]">
      <DialogHeader>
        <DialogTitle>Add Stock Transaction</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="transaction_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value as TransactionType);
                      form.setValue('item_id', '');
                      form.setValue('category_id', '');
                      setSelectedCategory(null);
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {transactionTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category (Optional)</FormLabel>
                  <Select 
                    onValueChange={handleCategoryChange}
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="all-categories">All Categories</SelectItem>
                      {categories?.map(category => {
                        const safeValue = getSafeValue(category.id, 'category', category.name);
                        return (
                          <SelectItem key={safeValue} value={safeValue}>
                            {category.name || 'Unnamed Category'}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="item_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item</FormLabel>
                <Select 
                  onValueChange={handleItemChange}
                  value={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredItems.map(item => {
                      const safeValue = getSafeValue(item.id, 'item', item.name);
                      return (
                        <SelectItem key={safeValue} value={safeValue}>
                          {item.name || 'Unnamed Item'}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="direction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Direction</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select direction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="increase">Increase Stock</SelectItem>
                      <SelectItem value="decrease">Decrease Stock</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)} 
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cost_per_unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost Per Unit</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)} 
                      min={0}
                      step="0.01"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="total_cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Cost</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      {...field} 
                      disabled
                      value={field.value.toFixed(2)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(value as TransactionStatus)} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Status</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(value as PaymentStatus)} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentStatusOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)} 
                      min={0}
                      step="0.01"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paid_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paid Amount</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)} 
                      min={0}
                      step="0.01"
                      disabled={paymentStatus === 'paid' || paymentStatus === 'unpaid'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="supplier_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier (Optional)</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliers?.map(supplier => {
                        const safeValue = getSafeValue(supplier.id, 'supplier', supplier.first_name);
                        return (
                          <SelectItem key={safeValue} value={safeValue}>
                            {supplier.first_name || ''} {supplier.last_name || ''}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiration_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiration Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="reference_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Invoice or reference number" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Add additional notes here" 
                    {...field} 
                    value={field.value || ''} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Transaction
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default AddStockTransactionForm;
