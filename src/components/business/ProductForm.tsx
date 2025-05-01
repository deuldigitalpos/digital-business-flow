import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  BusinessProduct, 
  ProductFormValues, 
  BusinessProductSize, 
  RecipeItem, 
  ModifierItem,
  ConsumableItem 
} from '@/types/business-product';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import { useBusinessBrands } from '@/hooks/useBusinessBrands';
import { useBusinessWarranties } from '@/hooks/useBusinessWarranties';
import { useBusinessLocations } from '@/hooks/useBusinessLocations';
import { useBusinessUnits } from '@/hooks/useBusinessUnits';
import { useBusinessProductMutations } from '@/hooks/useBusinessProductMutations';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom'; // Replaced next/navigation with react-router-dom
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { Plus, Trash } from 'lucide-react';

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
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import RecipeItemForm from './RecipeItemForm';
import ConsumableItemForm from './ConsumableItemForm';

// Import the new ConsumableItemForm
import ConsumableItemForm from './ConsumableItemForm';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  sku: z.string().optional(),
  description: z.string().optional(),
  category_id: z.string().optional(),
  brand_id: z.string().optional(),
  warranty_id: z.string().optional(),
  location_id: z.string().optional(),
  image_url: z.string().optional(),
  expiration_date: z.string().optional(),
  alert_quantity: z.coerce.number().optional(),
  is_consumable: z.boolean().default(false).optional(),
  unit_price: z.coerce.number().optional(),
  selling_price: z.coerce.number().optional(),
  has_recipe: z.boolean().default(false).optional(),
  has_modifiers: z.boolean().default(false).optional(),
  has_consumables: z.boolean().default(false).optional(),
  sizes: z.array(
    z.object({
      size_name: z.string(),
      price: z.coerce.number(),
    })
  ).optional(),
  recipe_items: z.array(
    z.object({
      ingredient_id: z.string(),
      quantity: z.number(),
      unit_id: z.string().nullable(),
      cost: z.number()
    })
  ).optional(),
  modifier_items: z.array(
    z.object({
      name: z.string(),
      size_regular_price: z.number(),
      size_medium_price: z.number().nullable(),
      size_large_price: z.number().nullable(),
      size_xl_price: z.number().nullable()
    })
  ).optional(),
  consumable_items: z.array(
    z.object({
      consumable_id: z.string(),
      quantity: z.number(),
      unit_id: z.string().nullable(),
      cost: z.number()
    })
  ).optional()
});

interface ProductFormProps {
  initialValues?: ProductFormValues;
  onSuccess?: () => void;
  productId?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  initialValues, 
  onSuccess,
  productId 
}) => {
  const { data: categories } = useBusinessCategories();
  const { data: brands } = useBusinessBrands();
  const { data: warranties } = useBusinessWarranties();
  const { data: locations } = useBusinessLocations();
  const { data: units } = useBusinessUnits();
  const { createProduct, updateProduct } = useBusinessProductMutations();
  const navigate = useNavigate(); // Changed from useRouter to useNavigate
  const { business } = useBusinessAuth();
  
  const [sizes, setSizes] = useState<{ size_name: string; price: number; }[]>([]);
  const [recipeItems, setRecipeItems] = useState<RecipeItem[]>([
    { ingredient_id: '', quantity: 0, unit_id: null, cost: 0 }
  ]);
  const [modifierItems, setModifierItems] = useState<ModifierItem[]>([
    { name: '', size_regular_price: 0, size_medium_price: null, size_large_price: null, size_xl_price: null }
  ]);
  
  // Add state for consumable items
  const [consumableItems, setConsumableItems] = useState<ConsumableItem[]>([
    { consumable_id: '', quantity: 0, unit_id: null, cost: 0 }
  ]);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      sku: '',
      description: '',
      category_id: 'none',
      brand_id: 'none',
      warranty_id: 'none',
      location_id: 'none',
      image_url: '',
      expiration_date: '',
      alert_quantity: 10,
      is_consumable: false,
      unit_price: 0,
      selling_price: 0,
      has_recipe: false,
      has_modifiers: false,
      has_consumables: false,
      sizes: [],
      recipe_items: [],
      modifier_items: [],
      consumable_items: []
    }
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
      setSizes(initialValues.sizes || []);
    }

    if (productId) {
      loadProduct(productId);
    }
  }, [initialValues, productId, form]);

  const loadProduct = async (productId: string) => {
    try {
      const { data: product, error } = await supabase
        .from('business_products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product data');
        return;
      }

      if (product) {
        loadProductData(product);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product data');
    }
  };

  // Modify loadProductData to handle all product data properly
  const loadProductData = async (product: any) => {
    form.setValue('name', product.name);
    form.setValue('sku', product.sku || '');
    form.setValue('description', product.description || '');
    form.setValue('category_id', product.category_id || 'none');
    form.setValue('brand_id', product.brand_id || 'none');
    form.setValue('warranty_id', product.warranty_id || 'none');
    form.setValue('location_id', product.location_id || 'none');
    form.setValue('image_url', product.image_url || '');
    form.setValue('expiration_date', product.expiration_date || '');
    form.setValue('alert_quantity', product.alert_quantity || 10);
    form.setValue('is_consumable', product.is_consumable || false);
    form.setValue('unit_price', product.unit_price || 0);
    form.setValue('selling_price', product.selling_price || 0);
    form.setValue('has_recipe', product.has_recipe || false);
    form.setValue('has_modifiers', product.has_modifiers || false);
    form.setValue('has_consumables', product.has_consumables || false);
    
    // Load product sizes
    if (product.business_product_sizes && product.business_product_sizes.length > 0) {
      const formattedSizes = product.business_product_sizes.map((size: any) => ({
        size_name: size.size_name,
        price: size.price
      }));
      setSizes(formattedSizes);
    }
    
    // Load recipe items if any using fetch API instead of direct Supabase query
    if (product.has_recipe) {
      try {
        // First disable RLS
        await supabase.rpc('disable_rls');
        
        // Fetch recipes using fetch API
        const recipesResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/business_product_recipes?product_id=eq.${product.id}&select=*`,
          {
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Re-enable RLS
        await supabase.rpc('enable_rls');
        
        if (recipesResponse.ok) {
          const productRecipes = await recipesResponse.json();
          if (productRecipes && productRecipes.length > 0) {
            const formattedRecipes = productRecipes.map((item: any) => ({
              ingredient_id: item.ingredient_id,
              quantity: item.quantity,
              unit_id: item.unit_id,
              cost: item.cost
            }));
            setRecipeItems(formattedRecipes);
            form.setValue('recipe_items', formattedRecipes);
          }
        }
      } catch (error) {
        console.error('Error loading recipe items:', error);
      }
    }
    
    // Load consumable items if any using fetch API
    if (product.has_consumables) {
      try {
        // First disable RLS
        await supabase.rpc('disable_rls');
        
        // Fetch consumables using fetch API
        const consumablesResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/business_product_consumables?product_id=eq.${product.id}&select=*`,
          {
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Re-enable RLS
        await supabase.rpc('enable_rls');
        
        if (consumablesResponse.ok) {
          const productConsumables = await consumablesResponse.json();
          if (productConsumables && productConsumables.length > 0) {
            const formattedConsumables = productConsumables.map((item: any) => ({
              consumable_id: item.consumable_id,
              quantity: item.quantity,
              unit_id: item.unit_id,
              cost: item.cost
            }));
            setConsumableItems(formattedConsumables);
            form.setValue('consumable_items', formattedConsumables);
          }
        }
      } catch (error) {
        console.error('Error loading consumable items:', error);
      }
    }
    
    // Load modifiers if any using fetch API
    if (product.has_modifiers) {
      try {
        // First disable RLS
        await supabase.rpc('disable_rls');
        
        // Fetch modifiers using fetch API
        const modifiersResponse = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/business_product_modifiers?product_id=eq.${product.id}&select=*`,
          {
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Re-enable RLS
        await supabase.rpc('enable_rls');
        
        if (modifiersResponse.ok) {
          const productModifiers = await modifiersResponse.json();
          if (productModifiers && productModifiers.length > 0) {
            const formattedModifiers = productModifiers.map((item: any) => ({
              name: item.name,
              size_regular_price: item.size_regular_price,
              size_medium_price: item.size_medium_price,
              size_large_price: item.size_large_price,
              size_xl_price: item.size_xl_price
            }));
            setModifierItems(formattedModifiers);
            form.setValue('modifier_items', formattedModifiers);
          }
        }
      } catch (error) {
        console.error('Error loading modifier items:', error);
      }
    }
  };

  const handleSubmit = async (values: ProductFormValues) => {
    console.log('Form values on submit:', values);
  };

  const handleAddSize = () => {
    setSizes([...sizes, { size_name: '', price: 0 }]);
  };

  const handleRemoveSize = (index: number) => {
    const newSizes = [...sizes];
    newSizes.splice(index, 1);
    setSizes(newSizes);
  };

  const handleSizeChange = (index: number, field: string, value: string | number) => {
    const newSizes = [...sizes];
    newSizes[index][field] = typeof value === 'string' ? value : Number(value);
    setSizes(newSizes);
  };
  
  // Add recipe item handlers
  const handleAddRecipeItem = () => {
    const newRecipeItems = [
      ...recipeItems, 
      { ingredient_id: '', quantity: 0, unit_id: null, cost: 0 }
    ];
    setRecipeItems(newRecipeItems);
    form.setValue('recipe_items', newRecipeItems);
  };

  const handleRemoveRecipeItem = (index: number) => {
    const newRecipeItems = [...recipeItems];
    newRecipeItems.splice(index, 1);
    setRecipeItems(newRecipeItems);
    form.setValue('recipe_items', newRecipeItems);
  };

  const handleRecipeItemChange = (index: number, value: RecipeItem) => {
    const newRecipeItems = [...recipeItems];
    newRecipeItems[index] = value;
    setRecipeItems(newRecipeItems);
    form.setValue('recipe_items', newRecipeItems);
  };
  
  // Add consumable item handlers
  const handleAddConsumableItem = () => {
    const newConsumableItems = [
      ...consumableItems, 
      { consumable_id: '', quantity: 0, unit_id: null, cost: 0 }
    ];
    setConsumableItems(newConsumableItems);
    form.setValue('consumable_items', newConsumableItems);
  };

  const handleRemoveConsumableItem = (index: number) => {
    const newConsumableItems = [...consumableItems];
    newConsumableItems.splice(index, 1);
    setConsumableItems(newConsumableItems);
    form.setValue('consumable_items', newConsumableItems);
  };

  const handleConsumableItemChange = (index: number, value: ConsumableItem) => {
    const newConsumableItems = [...consumableItems];
    newConsumableItems[index] = value;
    setConsumableItems(newConsumableItems);
    form.setValue('consumable_items', newConsumableItems);
  };

  const handleAddModifier = () => {
    setModifierItems([
      ...modifierItems,
      { name: '', size_regular_price: 0, size_medium_price: null, size_large_price: null, size_xl_price: null }
    ]);
  };

  const handleRemoveModifier = (index: number) => {
    const newModifierItems = [...modifierItems];
    newModifierItems.splice(index, 1);
    setModifierItems(newModifierItems);
  };

  const handleModifierChange = (index: number, field: string, value: string | number | null) => {
    const newModifierItems = [...modifierItems];
    
    if (field === 'size_regular_price' || field === 'size_medium_price' || field === 'size_large_price' || field === 'size_xl_price') {
      newModifierItems[index][field] = value !== null ? Number(value) : null;
    } else {
      newModifierItems[index][field] = value as string;
    }
    
    setModifierItems(newModifierItems);
  };

  // Add consumable form preparation before submit
  const onSubmit = async (values: ProductFormValues) => {
    try {
      // Validate sizes to ensure size_name is not empty and price is a number
      if (sizes.some(size => !size.size_name || isNaN(Number(size.price)))) {
        toast.error('Please ensure all sizes have a name and a valid price.');
        return;
      }

      // Prepare sizes for submission
      values.sizes = sizes.filter(size => size.size_name && !isNaN(Number(size.price)));
      
      // Prepare recipe items if any
      if (values.has_recipe && recipeItems) {
        values.recipe_items = recipeItems.filter(item => item.ingredient_id);
      } else {
        values.recipe_items = [];
      }
      
      // Prepare consumable items if any
      if (values.has_consumables && consumableItems) {
        values.consumable_items = consumableItems.filter(item => item.consumable_id);
      } else {
        values.consumable_items = [];
      }
      
      // Prepare modifier items if any
      if (values.has_modifiers && modifierItems) {
        values.modifier_items = modifierItems.filter(item => item.name);
      } else {
        values.modifier_items = [];
      }
      
      if (productId) {
        // Update existing product
        await updateProduct.mutateAsync({ id: productId, data: values });
      } else {
        // Create new product
        await createProduct.mutateAsync(values);
      }

      toast.success('Product saved successfully!');
      if (onSuccess) onSuccess();
      navigate('/BusinessProducts'); // Changed from router.push to navigate
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to save product. Please check the form for errors.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name" {...field} />
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
                    <Input placeholder="SKU" {...field} />
                  </FormControl>
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
                    <Textarea placeholder="Description" {...field} />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {categories?.map((category) => (
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {brands?.map((brand) => (
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
            <FormField
              control={form.control}
              name="warranty_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warranty</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a warranty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {warranties?.map((warranty) => (
                        <SelectItem key={warranty.id} value={warranty.id}>
                          {warranty.name}
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
                  <FormLabel>Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {locations?.map((location) => (
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
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Image URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiration_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiration Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                    />
                  </FormControl>
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
                      placeholder="Alert Quantity"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Replace is_raw_ingredient with has_consumables */}
            <FormField
              control={form.control}
              name="has_consumables"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Requires Consumables</FormLabel>
                    <FormDescription>
                      Does this product use consumables like packaging, napkins, etc?
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
                    <FormLabel className="text-base">Is Consumable</FormLabel>
                    <FormDescription>
                      Is this product a consumable item?
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
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sizes</CardTitle>
            <CardDescription>
              Add different sizes for this product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sizes.map((size, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="grid gap-2">
                    <FormItem>
                      <FormLabel>Size Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          value={size.size_name}
                          onChange={(e) => handleSizeChange(index, 'size_name', e.target.value)}
                          placeholder="Size Name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                  <div className="grid gap-2">
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={size.price}
                          onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                          placeholder="Price"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSize(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={handleAddSize}>
                <Plus className="h-4 w-4 mr-2" />
                Add Size
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recipe section */}
        {form.watch('has_recipe') && (
          <div className="border rounded-md p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Recipe</h3>
              <Button 
                type="button" 
                onClick={handleAddRecipeItem}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Ingredient
              </Button>
            </div>
            
            <div className="space-y-3">
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
        )}
        
        {/* Add Consumables section */}
        {form.watch('has_consumables') && (
          <div className="border rounded-md p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Consumables</h3>
              <Button 
                type="button" 
                onClick={handleAddConsumableItem}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Consumable
              </Button>
            </div>
            
            <div className="space-y-3">
              {consumableItems.map((item, index) => (
                <ConsumableItemForm
                  key={index}
                  index={index}
                  value={item}
                  onChange={handleConsumableItemChange}
                  onRemove={handleRemoveConsumableItem}
                  isRemovable={consumableItems.length > 1}
                />
              ))}
            </div>
          </div>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Modifiers</CardTitle>
            <CardDescription>
              Add different modifiers for this product (e.g. toppings, flavors)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="has_modifiers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Has Modifiers</FormLabel>
                    <FormDescription>
                      Does this product have modifiers?
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

            {form.watch('has_modifiers') && (
              <div className="space-y-4">
                {modifierItems.map((modifier, index) => (
                  <div key={index} className="space-y-2 border rounded-md p-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Modifier {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveModifier(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`modifier_name_${index}`}
                        render={() => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                value={modifier.name}
                                onChange={(e) => handleModifierChange(index, 'name', e.target.value)}
                                placeholder="Modifier Name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`modifier_size_regular_price_${index}`}
                        render={() => (
                          <FormItem>
                            <FormLabel>Regular Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                value={modifier.size_regular_price}
                                onChange={(e) => handleModifierChange(index, 'size_regular_price', e.target.value)}
                                placeholder="Regular Price"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`modifier_size_medium_price_${index}`}
                        render={() => (
                          <FormItem>
                            <FormLabel>Medium Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                value={modifier.size_medium_price || ''}
                                onChange={(e) => handleModifierChange(index, 'size_medium_price', e.target.value === '' ? null : e.target.value)}
                                placeholder="Medium Price"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`modifier_size_large_price_${index}`}
                        render={() => (
                          <FormItem>
                            <FormLabel>Large Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                value={modifier.size_large_price || ''}
                                onChange={(e) => handleModifierChange(index, 'size_large_price', e.target.value === '' ? null : e.target.value)}
                                placeholder="Large Price"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`modifier_size_xl_price_${index}`}
                        render={() => (
                          <FormItem>
                            <FormLabel>X-Large Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                value={modifier.size_xl_price || ''}
                                onChange={(e) => handleModifierChange(index, 'size_xl_price', e.target.value === '' ? null : e.target.value)}
                                placeholder="X-Large Price"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={handleAddModifier}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Modifier
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="pt-6 space-x-2 flex justify-end">
          <Button type="submit">Submit</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/BusinessProducts')}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
