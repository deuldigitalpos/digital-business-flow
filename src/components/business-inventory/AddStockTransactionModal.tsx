import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useBusinessStockMutations } from '@/hooks/useBusinessStockMutations';
import { useBusinessConsumables } from '@/hooks/useBusinessConsumables';
import { useBusinessIngredients } from '@/hooks/useBusinessIngredients';
import { useBusinessAddons } from '@/hooks/useBusinessAddons';
import { useBusinessSuppliers } from '@/hooks/useBusinessSuppliers';
import { useBusinessUnits } from '@/hooks/useBusinessUnits';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

// Form validation schema
const stockTransactionSchema = z.object({
  transaction_type: z.enum(['consumable', 'ingredient', 'addon', 'product']),
  item_id: z.string().uuid(),
  transaction_date: z.date(),
  quantity: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().positive()
  ),
  unit_id: z.string().uuid().optional(),
  cost_per_unit: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().min(0)
  ),
  status: z.enum(['delivered', 'ordered', 'damaged', 'returned']),
  payment_status: z.enum(['paid', 'unpaid', 'partial', 'refunded']),
  supplier_id: z.string().uuid().optional(),
  discount: z.preprocess(
    (val) => (val === '' ? 0 : Number(val)),
    z.number().min(0).default(0)
  ),
  paid_amount: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  notes: z.string().optional(),
});

type StockTransactionFormValues = z.infer<typeof stockTransactionSchema>;

interface AddStockTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddStockTransactionModal: React.FC<AddStockTransactionModalProps> = ({ isOpen, onClose }) => {
  const { businessUser } = useBusinessAuth(); // Add this to access the business user
  const { createStockTransaction } = useBusinessStockMutations();
  const { consumables } = useBusinessConsumables();
  const { ingredients } = useBusinessIngredients();
  const { addons } = useBusinessAddons();
  const { suppliers } = useBusinessSuppliers();
  const unitsQuery = useBusinessUnits();
  // Fix #1: Extract the data property from the query result
  const units = unitsQuery.data || [];

  const [selectedType, setSelectedType] = useState<string | null>(null);

  const form = useForm<StockTransactionFormValues>({
    resolver: zodResolver(stockTransactionSchema),
    defaultValues: {
      transaction_date: new Date(),
      quantity: undefined,
      cost_per_unit: undefined,
      status: 'delivered',
      payment_status: 'paid',
      discount: 0,
      notes: '',
    },
  });

  // Get available items based on selected type
  const getItemsForType = () => {
    switch (selectedType) {
      case 'consumable':
        return consumables || [];
      case 'ingredient':
        return ingredients || [];
      case 'addon':
        return addons || [];
      case 'product':
        return []; // In a real app, this would fetch products
      default:
        return [];
    }
  };

  // Calculate total cost based on form values
  const calculateTotal = () => {
    const quantity = form.watch('quantity');
    const costPerUnit = form.watch('cost_per_unit');
    const discount = form.watch('discount');

    if (!quantity || !costPerUnit) return 0;
    
    const total = quantity * costPerUnit;
    return total - (discount || 0);
  };

  const onSubmit = async (values: StockTransactionFormValues) => {
    try {
      const totalCost = calculateTotal();
      const paidAmount = values.payment_status === 'paid' ? totalCost : (values.paid_amount || 0);
      const unpaidAmount = values.payment_status === 'paid' ? 0 : (totalCost - (values.paid_amount || 0));
      
      // Fix #2: Include all required properties from the StockTransaction type
      // Fix #3: Add the created_by property from the business user
      const transactionData = {
        transaction_type: values.transaction_type,
        item_id: values.item_id,
        transaction_date: values.transaction_date,
        quantity: values.quantity,
        unit_id: values.unit_id,
        cost_per_unit: values.cost_per_unit || 0,
        status: values.status,
        payment_status: values.payment_status,
        supplier_id: values.supplier_id,
        discount: values.discount || 0,
        total_cost: totalCost,
        paid_amount: paidAmount,
        unpaid_amount: unpaidAmount,
        notes: values.notes,
        // Add missing required fields with null or default values
        reference_id: null,
        brand_id: null,
        warranty_id: null,
        due_date: null,
        expiration_date: null,
        created_by: businessUser?.id || null
      };
      
      await createStockTransaction.mutateAsync(transactionData);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Error creating stock transaction:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Stock Transaction</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Transaction Type */}
              <FormField
                control={form.control}
                name="transaction_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedType(value);
                        form.setValue('item_id', ''); // Reset item when type changes
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="consumable">Consumable</SelectItem>
                        <SelectItem value="ingredient">Ingredient</SelectItem>
                        <SelectItem value="addon">Add-on</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Item Selection */}
              <FormField
                control={form.control}
                name="item_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!selectedType}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getItemsForType().map((item) => (
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

              {/* Transaction Date */}
              <FormField
                control={form.control}
                name="transaction_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
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

              {/* Quantity */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter quantity"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Unit */}
              <FormField
                control={form.control}
                name="unit_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.name} ({unit.short_name})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cost Per Unit */}
              <FormField
                control={form.control}
                name="cost_per_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Per Unit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter cost per unit"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Total Cost (Calculated) */}
              <FormItem>
                <FormLabel>Total Cost</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={calculateTotal()}
                    readOnly
                    className="bg-gray-50"
                  />
                </FormControl>
                <FormDescription>Automatically calculated</FormDescription>
              </FormItem>

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="ordered">Ordered</SelectItem>
                        <SelectItem value="damaged">Damaged</SelectItem>
                        <SelectItem value="returned">Returned</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Status */}
              <FormField
                control={form.control}
                name="payment_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Supplier */}
              <FormField
                control={form.control}
                name="supplier_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select supplier (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers?.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {/* Fix #3: Use supplier_id property, or first+last name if not available */}
                            {supplier.business_name || `${supplier.first_name} ${supplier.last_name}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Discount */}
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter discount"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Paid Amount - Only visible if payment_status is not 'paid' */}
              {form.watch('payment_status') !== 'paid' && (
                <FormField
                  control={form.control}
                  name="paid_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paid Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter paid amount"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Additional notes (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={createStockTransaction.isPending}>
                {createStockTransaction.isPending ? 'Saving...' : 'Save Transaction'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStockTransactionModal;
