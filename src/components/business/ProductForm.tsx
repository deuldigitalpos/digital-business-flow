
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useBusinessProductMutations } from '@/hooks/useBusinessProductMutations';
import { BusinessProduct, ProductFormValues } from '@/types/business-product';
import { useBusinessBrands } from '@/hooks/useBusinessBrands';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import { useBusinessWarranties } from '@/hooks/useBusinessWarranties';
import { useBusinessLocations } from '@/hooks/useBusinessLocations';
import { useBusinessIngredients } from '@/hooks/useBusinessIngredients';
import { useBusinessConsumables } from '@/hooks/useBusinessConsumables';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Minus, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

// Define the schema for the form validation
const formSchema = z.object({
  name: z.string().min(1, { message: 'Product name is required' }),
  sku: z.string().optional(),
  description: z.string().optional(),
  category_id: z.string().optional(),
  brand_id: z.string().optional(),
  warranty_id: z.string().optional(),
  location_id: z.string().optional(),
  image_url: z.string().optional(),
  expiration_date: z.date().optional(),
  alert_quantity: z.coerce.number().int().min(0).optional(),
  is_raw_ingredient: z.boolean().default(false),
  is_consumable: z.boolean().default(false),
  ingredient_id: z.string().optional(),
  consumable_id: z.string().optional(),
  sizes: z.array(
    z.object({
      size_name: z.string().min(1, { message: 'Size name is required' }),
      price: z.coerce.number().positive({ message: 'Price must be positive' })
    })
  ).optional()
});

interface ProductFormProps {
  product?: BusinessProduct;
  onSuccess?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSuccess }) => {
  const { createProduct, updateProduct } = useBusinessProductMutations();
  const { data: brands = [] } = useBusinessBrands();
  const { data: categories = [] } = useBusinessCategories();
  const { data: warranties = [] } = useBusinessWarranties();
  const { data: locations = [] } = useBusinessLocations();
  const { data: ingredients = [] } = useBusinessIngredients();
  const { data: consumables = [] } = useBusinessConsumables();
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with default values or values from the product being edited
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || '',
      sku: product?.sku || '',
      description: product?.description || '',
      category_id: product?.category_id || '',
      brand_id: product?.brand_id || '',
      warranty_id: product?.warranty_id || '',
      location_id: product?.location_id || '',
      image_url: product?.image_url || '',
      expiration_date: product?.expiration_date ? new Date(product.expiration_date) : undefined,
      alert_quantity: product?.alert_quantity ?? 10,
      is_raw_ingredient: product?.is_raw_ingredient || false,
      is_consumable: product?.is_consumable || false,
      ingredient_id: product?.ingredient_id || '',
      consumable_id: product?.consumable_id || '',
      sizes: []
    }
  });

  // Watch for changes in the is_raw_ingredient and is_consumable fields
  const isRawIngredient = form.watch('is_raw_ingredient');
  const isConsumable = form.watch('is_consumable');

  // State for product sizes
  const [sizes, setSizes] = useState<{ size_name: string; price: number }[]>([
    { size_name: 'Regular', price: 0 }
  ]);

  // Load existing product sizes if editing
  useEffect(() => {
    if (product?.business_product_sizes && product.business_product_sizes.length > 0) {
      // Convert product sizes to expected format and set the state
      const productSizes = product.business_product_sizes.map((size) => ({
        size_name: size.size_name,
        price: size.price
      }));
      setSizes(productSizes);
    }
  }, [product]);

  // Handle adding a new size
  const handleAddSize = () => {
    setSizes([...sizes, { size_name: '', price: 0 }]);
  };

  // Handle removing a size
  const handleRemoveSize = (index: number) => {
    const newSizes = [...sizes];
    newSizes.splice(index, 1);
    setSizes(newSizes);
  };

  // Handle updating a size
  const handleSizeChange = (index: number, field: 'size_name' | 'price', value: string | number) => {
    const newSizes = [...sizes];
    newSizes[index][field] = value as never;
    setSizes(newSizes);
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Add sizes to the form data
      const formData: ProductFormValues = {
        ...values,
        name: values.name, // Ensure name is explicitly set to fix type error
        sizes: sizes.filter(size => size.size_name.trim() !== '')
      };

      if (product) {
        // Update existing product
        await updateProduct.mutateAsync({
          id: product.id,
          data: formData
        });
        toast.success('Product updated successfully');
      } else {
        // Create new product
        await createProduct.mutateAsync(formData);
        toast.success('Product created successfully');
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(`Failed to ${product ? 'update' : 'create'} product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Product Details</h3>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter SKU (optional)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Stock Keeping Unit for inventory tracking
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter product description (optional)" 
                      {...field} 
                      value={field.value || ''}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
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
              name="brand_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a brand (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium">Inventory & Location</h3>

            <FormField
              control={form.control}
              name="warranty_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warranty</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a warranty (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {warranties.map((warranty) => (
                        <SelectItem key={warranty.id} value={warranty.id}>
                          {warranty.name} ({warranty.duration} {warranty.duration_unit})
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
              name="location_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Location</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
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
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter image URL (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiration_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expiration Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date (optional)</span>
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

            <FormField
              control={form.control}
              name="alert_quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alert Quantity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      placeholder="Enter alert quantity" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    System will alert when stock falls below this quantity
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-6">
          <h3 className="text-lg font-medium">Product Type and Composition</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="is_raw_ingredient"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Raw Ingredient</FormLabel>
                    <FormDescription>
                      Check if this product uses a raw ingredient
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_consumable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Consumable</FormLabel>
                    <FormDescription>
                      Check if this product uses consumable items
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {isRawIngredient && (
            <FormField
              control={form.control}
              name="ingredient_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Ingredient</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an ingredient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {ingredients.map((ingredient) => (
                        <SelectItem key={ingredient.id} value={ingredient.id}>
                          {ingredient.name} - {ingredient.unit_price} per unit ({ingredient.quantity_available} available)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {isConsumable && (
            <FormField
              control={form.control}
              name="consumable_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Consumable</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a consumable" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {consumables.map((consumable) => (
                        <SelectItem key={consumable.id} value={consumable.id}>
                          {consumable.name} - {consumable.unit_price} per unit ({consumable.quantity_available} available)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <Separator />

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Product Sizes and Pricing</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={handleAddSize}
              className="gap-1"
            >
              <Plus className="h-4 w-4" /> Add Size
            </Button>
          </div>

          <div className="space-y-4">
            {sizes.map((size, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-1/3">
                  <label className="text-sm font-medium mb-1 block">Size Name</label>
                  <Input
                    placeholder="e.g., Regular, Medium, Large"
                    value={size.size_name}
                    onChange={(e) => handleSizeChange(index, 'size_name', e.target.value)}
                  />
                </div>
                <div className="w-1/3">
                  <label className="text-sm font-medium mb-1 block">Price</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter price"
                    value={size.price || ''}
                    onChange={(e) => handleSizeChange(index, 'price', parseFloat(e.target.value))}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSize(index)}
                    disabled={sizes.length <= 1}
                    className="mb-0.5"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {product ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
