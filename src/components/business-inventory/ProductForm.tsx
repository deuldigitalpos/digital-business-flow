
import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductConsumableInput, ProductIngredientInput, ProductSizeInput } from "@/types/business-product";
import { useBusinessCategories } from "@/hooks/useBusinessCategories";
import { useBusinessUnits } from "@/hooks/useBusinessUnits";
import useBusinessBrands from "@/hooks/useBusinessBrands";
import useBusinessWarranties from "@/hooks/useBusinessWarranties";
import useBusinessIngredients from "@/hooks/useBusinessIngredients";
import useBusinessConsumables from "@/hooks/useBusinessConsumables";
import ProductIngredientsTable from "@/components/business-inventory/ProductIngredientsTable";
import ProductConsumablesTable from "@/components/business-inventory/ProductConsumablesTable";
import ProductSizesTable from "@/components/business-inventory/ProductSizesTable";

interface ProductFormProps {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => Promise<void>;
  ingredients: ProductIngredientInput[];
  setIngredients: React.Dispatch<React.SetStateAction<ProductIngredientInput[]>>;
  consumables: ProductConsumableInput[];
  setConsumables: React.Dispatch<React.SetStateAction<ProductConsumableInput[]>>;
  sizes: ProductSizeInput[];
  setSizes: React.Dispatch<React.SetStateAction<ProductSizeInput[]>>;
  isEditMode?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
  form, 
  onSubmit, 
  ingredients,
  setIngredients,
  consumables,
  setConsumables,
  sizes,
  setSizes,
  isEditMode = false 
}) => {
  const categoriesQuery = useBusinessCategories();
  const unitsQuery = useBusinessUnits();
  const { brands } = useBusinessBrands();
  const { warranties } = useBusinessWarranties();
  const { ingredients: allIngredients } = useBusinessIngredients();
  const { consumables: allConsumables } = useBusinessConsumables();
  
  const categories = categoriesQuery.data || [];
  const units = unitsQuery.data || [];
  
  const hasIngredients = form.watch("has_ingredients");
  const hasConsumables = form.watch("has_consumables");
  const hasSizes = form.watch("has_sizes");
  const autoGenerateSku = form.watch("auto_generate_sku");

  // Calculate total cost whenever ingredients or consumables change
  useEffect(() => {
    if (hasIngredients || hasConsumables) {
      const ingredientsCost = ingredients.reduce((sum, item) => sum + item.cost, 0);
      const consumablesCost = consumables.reduce((sum, item) => sum + item.cost, 0);
      const totalCost = ingredientsCost + consumablesCost;
      
      if (totalCost > 0) {
        form.setValue("cost_price", parseFloat(totalCost.toFixed(2)));
      }
    }
  }, [ingredients, consumables, hasIngredients, hasConsumables, form]);

  // Calculate profit margin whenever cost price or selling price change
  useEffect(() => {
    const costPrice = form.watch("cost_price");
    const sellingPrice = form.watch("selling_price");
    
    const costMargin = sellingPrice - costPrice;
    const profitMargin = costPrice > 0 ? (costMargin / costPrice) * 100 : 0;
    
    form.setValue("cost_margin", parseFloat(costMargin.toFixed(2)));
    form.setValue("profit_margin", parseFloat(profitMargin.toFixed(2)));
  }, [form.watch("cost_price"), form.watch("selling_price")]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic">
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            {hasIngredients && <TabsTrigger value="ingredients">Ingredients</TabsTrigger>}
            {hasConsumables && <TabsTrigger value="consumables">Consumables</TabsTrigger>}
            {hasSizes && <TabsTrigger value="sizes">Sizes</TabsTrigger>}
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Input 
                        placeholder={autoGenerateSku ? "Auto-generated" : "Enter SKU"} 
                        {...field} 
                        disabled={autoGenerateSku}
                      />
                    </FormControl>
                    <FormDescription>
                      <FormField
                        control={form.control}
                        name="auto_generate_sku"
                        render={({ field }) => (
                          <div className="flex items-center space-x-2 mt-2">
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              id="auto_generate_sku"
                            />
                            <label
                              htmlFor="auto_generate_sku"
                              className="text-sm cursor-pointer"
                            >
                              Auto-generate SKU
                            </label>
                          </div>
                        )}
                      />
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brand_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select brand (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
              
              <FormField
                control={form.control}
                name="warranty_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warranty</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select warranty (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {warranties.map((warranty) => (
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
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description (optional)"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
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
                    <Input placeholder="Enter image URL (optional)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a URL to a product image (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <h3 className="text-base font-medium">Product Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="has_ingredients"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="has_ingredients"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Add Ingredients
                        </FormLabel>
                        <FormDescription>
                          Use ingredients to calculate cost
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="has_consumables"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="has_consumables"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Add Consumables
                        </FormLabel>
                        <FormDescription>
                          Use consumables to calculate cost
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="has_sizes"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="has_sizes"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Add Size Variants
                        </FormLabel>
                        <FormDescription>
                          Create different sizes with prices
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>
          
          {hasIngredients && (
            <TabsContent value="ingredients" className="space-y-4">
              <h3 className="text-lg font-medium">Add Ingredients</h3>
              <p className="text-sm text-muted-foreground">
                Add ingredients to calculate the cost of your product.
              </p>
              
              <ProductIngredientsTable
                ingredients={ingredients}
                setIngredients={setIngredients}
                allIngredients={allIngredients}
                units={units}
              />
            </TabsContent>
          )}
          
          {hasConsumables && (
            <TabsContent value="consumables" className="space-y-4">
              <h3 className="text-lg font-medium">Add Consumables</h3>
              <p className="text-sm text-muted-foreground">
                Add consumables to calculate the cost of your product.
              </p>
              
              <ProductConsumablesTable
                consumables={consumables}
                setConsumables={setConsumables}
                allConsumables={allConsumables}
                units={units}
              />
            </TabsContent>
          )}
          
          {hasSizes && (
            <TabsContent value="sizes" className="space-y-4">
              <h3 className="text-lg font-medium">Add Size Variants</h3>
              <p className="text-sm text-muted-foreground">
                Add different sizes with additional prices.
              </p>
              
              <ProductSizesTable
                sizes={sizes}
                setSizes={setSizes}
                basePrice={form.watch("selling_price")}
              />
            </TabsContent>
          )}
          
          <TabsContent value="pricing" className="space-y-4">
            <h3 className="text-lg font-medium">Product Pricing</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cost_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        disabled={hasIngredients || hasConsumables}
                      />
                    </FormControl>
                    {(hasIngredients || hasConsumables) && (
                      <FormDescription>
                        Cost is calculated from ingredients and consumables
                      </FormDescription>
                    )}
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
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Cost Margin</h4>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm">
                  ${(form.watch("selling_price") - form.watch("cost_price")).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Selling price - cost price</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Profit Margin</h4>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-background text-sm">
                  {form.watch("cost_price") > 0 
                    ? `${(((form.watch("selling_price") - form.watch("cost_price")) / form.watch("cost_price")) * 100).toFixed(2)}%`
                    : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  (Selling price - cost price) ÷ cost price × 100%
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <Separator />
        
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {isEditMode ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
