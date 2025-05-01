
import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useBusinessProductMutations } from '@/hooks/useBusinessProductMutations';
import { BusinessProduct, ProductFormValues, RecipeItem, ModifierItem } from '@/types/business-product';
import { useBusinessBrands } from '@/hooks/useBusinessBrands';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import { useBusinessWarranties } from '@/hooks/useBusinessWarranties';
import { useBusinessLocations } from '@/hooks/useBusinessLocations';
import { useBusinessIngredients } from '@/hooks/useBusinessIngredients';
import { useBusinessConsumables } from '@/hooks/useBusinessConsumables';
import { useProductRecipes, useProductModifiers } from '@/hooks/useBusinessProductRecipeModifiers';
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
import { Checkbox } from '@/components/ui/checkbox';
import RecipeItemForm from './RecipeItemForm';
import ModifierItemForm from './ModifierItemForm';

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
  has_recipe: z.boolean().default(false),
  has_modifiers: z.boolean().default(false),
  unit_price: z.coerce.number().min(0).optional(),
  selling_price: z.coerce.number().min(0).optional(),
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
  const { data: productRecipes = [] } = useProductRecipes(product?.id);
  const { data: productModifiers = [] } = useProductModifiers(product?.id);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalRecipeCost, setTotalRecipeCost] = useState(0);

  // Initialize recipe items
  const [recipeItems, setRecipeItems] = useState<RecipeItem[]>([
    { ingredient_id: '', quantity: 0, unit_id: null, cost: 0 }
  ]);

  // Initialize modifier items
  const [modifierItems, setModifierItems] = useState<ModifierItem[]>([
    { name: '', size_regular_price: 0, size_medium_price: null, size_large_price: null, size_xl_price: null }
  ]);

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
      has_recipe: product?.has_recipe || false,
      has_modifiers: product?.has_modifiers || false,
      unit_price: product?.unit_price || 0,
      selling_price: product?.selling_price || 0,
      sizes: []
    }
  });

  // Watch for changes in form fields
  const isRawIngredient = form.watch('is_raw_ingredient');
  const isConsumable = form.watch('is_consumable');
  const hasRecipe = form.watch('has_recipe');
  const hasModifiers = form.watch('has_modifiers');
  const unitPrice = form.watch('unit_price');

  // Load existing product data if editing
  useEffect(() => {
    if (product) {
      // Load recipe items if available
      if (product.has_recipe && productRecipes.length > 0) {
        const loadedRecipeItems: RecipeItem[] = productRecipes.map(recipe => ({
          ingredient_id: recipe.ingredient_id,
          quantity: recipe.quantity,
          unit_id: recipe.unit_id,
          cost: recipe.cost
        }));
        setRecipeItems(loadedRecipeItems);
      }

      // Load modifier items if available
      if (product.has_modifiers && productModifiers.length > 0) {
        const loadedModifierItems: ModifierItem[] = productModifiers.map(modifier => ({
          name: modifier.name,
          size_regular_price: modifier.size_regular_price,
          size_medium_price: modifier.size_medium_price,
          size_large_price: modifier.size_large_price,
          size_xl_price: modifier.size_xl_price
        }));
        setModifierItems(loadedModifierItems);
      }

      // Update unit price field
      form.setValue('unit_price', product.unit_price || 0);
      form.setValue('selling_price', product.selling_price || 0);
    }
  }, [product, productRecipes, productModifiers]);

  // Calculate total recipe cost whenever recipe items change
  useEffect(() => {
    const total = recipeItems.reduce((sum, item) => sum + (item.cost || 0), 0);
    setTotalRecipeCost(total);
    
    // Update unit price with recipe cost if has recipe
    if (hasRecipe && total > 0) {
      form.setValue('unit_price', parseFloat(total.toFixed(2)));
    }
  }, [recipeItems, hasRecipe]);

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

  // Add recipe item
  const handleAddRecipeItem = () => {
    setRecipeItems([...recipeItems, { ingredient_id: '', quantity: 0, unit_id: null, cost: 0 }]);
  };

  // Remove recipe item
  const handleRemoveRecipeItem = (index: number) => {
    const newRecipeItems = [...recipeItems];
    newRecipeItems.splice(index, 1);
    setRecipeItems(newRecipeItems);
  };

  // Update recipe item
  const handleRecipeItemChange = (index: number, updatedItem: RecipeItem) => {
    const newRecipeItems = [...recipeItems];
    newRecipeItems[index] = updatedItem;
    setRecipeItems(newRecipeItems);
  };

  // Add modifier item
  const handleAddModifierItem = () => {
    setModifierItems([
      ...modifierItems,
      { name: '', size_regular_price: 0, size_medium_price: null, size_large_price: null, size_xl_price: null }
    ]);
  };

  // Remove modifier item
  const handleRemoveModifierItem = (index: number) => {
    const newModifierItems = [...modifierItems];
    newModifierItems.splice(index, 1);
    setModifierItems(newModifierItems);
  };

  // Update modifier item
  const handleModifierItemChange = (index: number, updatedItem: ModifierItem) => {
    const newModifierItems = [...modifierItems];
    newModifierItems[index] = updatedItem;
    setModifierItems(newModifierItems);
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Add sizes to the form data
      const formData: ProductFormValues = {
        ...values,
        name: values.name, // Ensure name is explicitly set to fix type error
        // Convert Date object to ISO string if it exists
        expiration_date: values.expiration_date ? values.expiration_date.toISOString() : undefined,
        sizes: sizes.filter(size => size.size_name.trim() !== ''),
        recipe_items: hasRecipe ? recipeItems.filter(item => !!item.ingredient_id) : undefined,
        modifier_items: hasModifiers ? modifierItems.filter(item => !!item.name) : undefined
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
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
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
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a brand (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="unit_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        disabled={hasRecipe}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      {hasRecipe ? 'Auto-calculated from recipe' : 'Cost price per unit'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="selling_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a warranty (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
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
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
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

            <FormField
              control={form.control}
              name="has_recipe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Recipe</FormLabel>
                    <FormDescription>
                      Check if this product has a recipe
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
              name="has_modifiers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Modifiers</FormLabel>
                    <FormDescription>
                      Check if this product has modifiers
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
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an ingredient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
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
                    value={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a consumable" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
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

        {hasRecipe && (
          <>
            <Separator />
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Recipe Ingredients</h3>
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium">
                    Total Cost: <span className="text-primary">{totalRecipeCost.toFixed(2)}</span>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleAddRecipeItem}
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add Ingredient
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {recipeItems.map((item, index) => (
                  <RecipeItemForm
                    key={index}
                    index={index}
                    value={item}
                    onChange={handleRecipeItemChange}
                    onRemove={handleRemoveRecipeItem}
                    isRemovable={recipeItems.length > 1}
                  />
                ))}
              </div>
            </div>
          </>
        )}
        
        {hasModifiers && (
          <>
            <Separator />
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Product Modifiers</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddModifierItem}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" /> Add Modifier
                </Button>
              </div>
              
              <div className="space-y-4">
                {modifierItems.map((item, index) => (
                  <ModifierItemForm
                    key={index}
                    index={index}
                    value={item}
                    onChange={handleModifierItemChange}
                    onRemove={handleRemoveModifierItem}
                    isRemovable={modifierItems.length > 1}
                  />
                ))}
              </div>
            </div>
          </>
        )}
        
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
