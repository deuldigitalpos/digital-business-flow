import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  BusinessProduct, 
  ProductFormValues, 
  BusinessProductSize, 
  RecipeItem, 
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
import { useNavigate } from 'react-router-dom';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { Plus, Trash, AlertTriangle, Upload, Image } from 'lucide-react';

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import RecipeItemForm from './RecipeItemForm';
import ConsumableItemForm from './ConsumableItemForm';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  sku: z.string().optional(),
  auto_generate_sku: z.boolean().default(false).optional(),
  description: z.string().optional(),
  category_id: z.string().optional(),
  brand_id: z.string().optional(),
  warranty_id: z.string().optional(),
  location_id: z.string().optional(),
  unit_id: z.string().optional(),
  image_url: z.string().optional(),
  alert_quantity: z.coerce.number().optional(),
  unit_price: z.coerce.number().optional(),
  selling_price: z.coerce.number().optional(),
  has_recipe: z.boolean().default(false).optional(),
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
  const navigate = useNavigate();
  const { business } = useBusinessAuth();
  
  const [sizes, setSizes] = useState<{ size_name: string; price: number; }[]>([]);
  const [recipeItems, setRecipeItems] = useState<RecipeItem[]>([
    { ingredient_id: '', quantity: 0, unit_id: null, cost: 0 }
  ]);
  const [consumableItems, setConsumableItems] = useState<ConsumableItem[]>([
    { consumable_id: '', quantity: 0, unit_id: null, cost: 0 }
  ]);

  const [totalRecipeCost, setTotalRecipeCost] = useState(0);
  const [belowCostWarning, setBelowCostWarning] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      sku: '',
      auto_generate_sku: false,
      description: '',
      category_id: 'none',
      brand_id: 'none',
      warranty_id: 'none',
      location_id: 'none',
      unit_id: 'none',
      image_url: '',
      alert_quantity: 10,
      unit_price: 0,
      selling_price: 0,
      has_recipe: false,
      has_consumables: false,
      sizes: [],
      recipe_items: [],
      consumable_items: []
    }
  });

  // Calculate total recipe cost when recipe items change
  useEffect(() => {
    if (form.watch('has_recipe') && recipeItems.length > 0) {
      const total = recipeItems.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);
      setTotalRecipeCost(total);
      
      // If recipe is enabled, update unit price based on recipe cost
      if (total > 0) {
        form.setValue('unit_price', total);
      }
    }
  }, [recipeItems, form]);

  // Check if selling price is below cost
  useEffect(() => {
    const unitPrice = Number(form.watch('unit_price') || 0);
    const sellingPrice = Number(form.watch('selling_price') || 0);
    
    setBelowCostWarning(sellingPrice < unitPrice && sellingPrice > 0);
  }, [form.watch('unit_price'), form.watch('selling_price')]);

  // Toggle SKU field based on auto_generate_sku
  useEffect(() => {
    const autoGenerateSku = form.watch('auto_generate_sku');
    if (autoGenerateSku) {
      form.setValue('sku', '');
    }
  }, [form.watch('auto_generate_sku')]);

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
      setSizes(initialValues.sizes || []);
      
      // Set image preview if image_url exists
      if (initialValues.image_url) {
        setImagePreview(initialValues.image_url);
      }
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
    form.setValue('auto_generate_sku', product.auto_generate_sku || false);
    form.setValue('description', product.description || '');
    form.setValue('category_id', product.category_id || 'none');
    form.setValue('brand_id', product.brand_id || 'none');
    form.setValue('warranty_id', product.warranty_id || 'none');
    form.setValue('location_id', product.location_id || 'none');
    form.setValue('unit_id', product.unit_id || 'none');
    form.setValue('image_url', product.image_url || '');
    form.setValue('alert_quantity', product.alert_quantity || 10);
    form.setValue('unit_price', product.unit_price || 0);
    form.setValue('selling_price', product.selling_price || 0);
    form.setValue('has_recipe', product.has_recipe || false);
    form.setValue('has_consumables', product.has_consumables || false);
    
    // Set image preview if image_url exists
    if (product.image_url) {
      setImagePreview(product.image_url);
    }
    
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
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setImageFile(selectedFile);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(selectedFile);
      setImagePreview(objectUrl);
      
      // Clear the input value to allow re-selection of the same file
      event.target.value = '';
    }
  };

  const uploadImage = async () => {
    if (!imageFile || !business) return null;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${business.id}/products/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('business-logos') // Changed from 'business_images' to 'business-logos'
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (error) {
        throw error;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-logos') // Changed from 'business_images' to 'business-logos'
        .getPublicUrl(filePath);
      
      setUploadProgress(100);
      setIsUploading(false);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      setIsUploading(false);
      return null;
    }
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

  // Calculate profit margin
  const calculateProfitMargin = () => {
    const costPrice = Number(form.watch('unit_price') || 0);
    const sellingPrice = Number(form.watch('selling_price') || 0);
    
    if (costPrice <= 0 || sellingPrice <= 0) return 0;
    
    const profit = sellingPrice - costPrice;
    const margin = (profit / sellingPrice) * 100;
    
    return margin.toFixed(2);
  };

  // Add consumable form preparation before submit
  const onSubmit = async (values: ProductFormValues) => {
    try {
      // Debugging logs
      console.log("Form values before submission:", values);
      console.log("Alert quantity (raw):", values.alert_quantity);
      console.log("Alert quantity type:", typeof values.alert_quantity);
      
      // Upload image if exists
      let imageUrl = values.image_url;
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          toast.error('Failed to upload image');
          return;
        }
      }
      
      // Update image_url with the uploaded image URL
      values.image_url = imageUrl;
      
      // Validate sizes to ensure size_name is not empty and price is a number
      if (sizes.some(size => !size.size_name || isNaN(Number(size.price)))) {
        toast.error('Please ensure all sizes have a name and a valid price.');
        return;
      }
      
      // CRITICAL: Ensure alert_quantity is a number
      values.alert_quantity = Number(values.alert_quantity || 10);
      
      // CRITICAL: Ensure proper numeric types for prices
      values.unit_price = Number(values.unit_price || 0);
      values.selling_price = Number(values.selling_price || 0);

      // Prepare sizes for submission
      values.sizes = sizes.filter(size => size.size_name && !isNaN(Number(size.price)));
      
      // Prepare recipe items if any
      if (values.has_recipe && recipeItems) {
        values.recipe_items = recipeItems
          .filter(item => item.ingredient_id)
          .map(item => ({
            ...item,
            quantity: Number(item.quantity),
            cost: Number(item.cost)
          }));
        // Update unit_price based on recipe cost
        values.unit_price = totalRecipeCost;
      } else {
        values.recipe_items = [];
      }
      
      // Prepare consumable items if any
      if (values.has_consumables && consumableItems) {
        values.consumable_items = consumableItems
          .filter(item => item.consumable_id)
          .map(item => ({
            ...item,
            quantity: Number(item.quantity),
            cost: Number(item.cost)
          }));
      } else {
        values.consumable_items = [];
      }

      // If auto-generate SKU is enabled, ensure SKU is empty for the database function to work
      if (values.auto_generate_sku) {
        values.sku = '';
      }
      
      if (productId) {
        // Update existing product
        await updateProduct.mutateAsync({ id: productId, data: values });
      } else {
        console.log("Creating new product with values:", {
          ...values,
          alert_quantity: values.alert_quantity
        });
        await createProduct.mutateAsync(values);
      }
      
      toast.success('Product saved successfully!');
      if (onSuccess) onSuccess();
      navigate('/business-dashboard/products');
    } catch (error) {
      console.error("Error submitting product form:", error);
      toast.error('Error saving product: ' + (error as Error).message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information Section */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details about the product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                name="auto_generate_sku"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Auto-generate SKU</FormLabel>
                      <FormDescription>
                        Automatically generate SKU based on category and sequence
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

              {!form.watch('auto_generate_sku') && (
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
              )}

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
                name="unit_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {units?.map((unit) => (
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

              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Image</FormLabel>
                    <div className="space-y-4">
                      <div className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-gray-400 transition-colors"
                           onClick={() => document.getElementById('product-image-upload')?.click()}>
                        <input
                          type="file"
                          id="product-image-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        {imagePreview ? (
                          <div className="relative w-full h-48">
                            <img
                              src={imagePreview}
                              alt="Product preview"
                              className="w-full h-full object-contain"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setImageFile(null);
                                setImagePreview(null);
                                form.setValue('image_url', '');
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center space-y-2">
                            <Image className="h-12 w-12 text-gray-400" />
                            <div className="text-center">
                              <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {isUploading && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          {/* Additional Details Section */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>
                Set properties like brand, warranty, and inventory levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    <FormDescription>
                      System will mark product as "Low Stock" when quantity falls below this threshold
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Product Sizes Section */}
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
                  <div className="flex-1">
                    <FormItem>
                      <FormLabel>Size Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Size name"
                          value={size.size_name}
                          onChange={(e) => handleSizeChange(index, 'size_name', e.target.value)}
                        />
                      </FormControl>
                    </FormItem>
                  </div>
                  <div className="flex-1">
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Price"
                          value={size.price}
                          onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                        />
                      </FormControl>
                    </FormItem>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="mt-8"
                    onClick={() => handleRemoveSize(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={handleAddSize}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Size
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Recipe Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Recipe</CardTitle>
              <CardDescription>
                Add ingredients to create a recipe for this product
              </CardDescription>
            </div>
            <FormField
              control={form.control}
              name="has_recipe"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardHeader>
          <CardContent>
            {form.watch('has_recipe') && (
              <div className="space-y-4">
                <Alert>
                  <AlertTitle className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Recipe Cost Information
                  </AlertTitle>
                  <AlertDescription>
                    The cost of this product will be automatically calculated based on the recipe ingredients.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4 mt-4">
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
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddRecipeItem}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ingredient
                </Button>
                
                <div className="mt-4 bg-gray-50 p-4 rounded-md">
                  <p className="text-sm font-medium text-gray-500">Total Recipe Cost</p>
                  <p className="text-xl font-medium">{totalRecipeCost.toFixed(2)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Consumables Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Consumables</CardTitle>
              <CardDescription>
                Add consumable items that are used with this product
              </CardDescription>
            </div>
            <FormField
              control={form.control}
              name="has_consumables"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardHeader>
          <CardContent>
            {form.watch('has_consumables') && (
              <div className="space-y-4">
                <Alert>
                  <AlertTitle className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Consumables Information
                  </AlertTitle>
                  <AlertDescription>
                    Consumables are items that are used with this product but not part of its recipe cost.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4 mt-4">
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
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddConsumableItem}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Consumable
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Product Pricing Section */}
        <Card>
          <CardHeader>
            <CardTitle>Product Pricing</CardTitle>
            <CardDescription>
              Set the cost and selling price for this product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormField
                  control={form.control}
                  name="unit_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Cost Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Unit Cost"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          value={field.value}
                          disabled={form.watch('has_recipe')}
                        />
                      </FormControl>
                      {form.watch('has_recipe') && (
                        <FormDescription>
                          Cost is automatically calculated from recipe ingredients
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <FormField
                  control={form.control}
                  name="selling_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Selling Price"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          value={field.value}
                          className={belowCostWarning ? "border-red-500" : ""}
                        />
                      </FormControl>
                      {belowCostWarning && (
                        <div className="text-red-500 text-xs mt-1 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Selling price is below cost price
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Cost Price</p>
                  <p className="text-lg font-medium">{Number(form.watch('unit_price') || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Selling Price</p>
                  <p className="text-lg font-medium">{Number(form.watch('selling_price') || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Profit</p>
                  <p className="text-lg font-medium">
                    {(Number(form.watch('selling_price') || 0) - Number(form.watch('unit_price') || 0)).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Profit Margin</p>
                  <p className="text-lg font-medium">{calculateProfitMargin()}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={() => navigate('/business-dashboard/products')}>
            Cancel
          </Button>
          <Button type="submit">Save Product</Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
