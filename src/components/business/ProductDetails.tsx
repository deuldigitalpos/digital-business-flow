import React, { useState } from 'react';
import { useBusinessProduct } from '@/hooks/useBusinessProducts';
import { useBusinessCategory } from '@/hooks/useBusinessCategory';
import { useBusinessBrand } from '@/hooks/useBusinessBrand';
import { useBusinessWarranty } from '@/hooks/useBusinessWarranty';
import { useBusinessLocation } from '@/hooks/useBusinessLocations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Archive, Pencil, Package, Tag, AlertTriangle, Info } from 'lucide-react';
import ProductForm from './ProductForm';
import { useProductRecipes, useProductConsumables } from '@/hooks/useBusinessProductRecipeModifiers';
import { useBusinessUnit } from '@/hooks/useBusinessUnit';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProductDetailsProps {
  productId: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId }) => {
  const { data: product, isLoading } = useBusinessProduct(productId);
  const { data: category } = useBusinessCategory(product?.category_id);
  const { data: brand } = useBusinessBrand(product?.brand_id);
  const { data: warranty } = useBusinessWarranty(product?.warranty_id);
  const { data: location } = useBusinessLocation(product?.location_id);
  const { data: unit } = useBusinessUnit(product?.unit_id);
  const { data: recipes = [] } = useProductRecipes(productId);
  const { data: consumables = [] } = useProductConsumables(productId);
  
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return <div className="flex justify-center p-6">Loading product details...</div>;
  }

  if (!product) {
    return <div className="text-center p-6">Product not found</div>;
  }

  if (isEditing) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Edit Product</CardTitle>
          <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
        </CardHeader>
        <CardContent>
          <ProductForm productId={product.id} onSuccess={() => setIsEditing(false)} />
        </CardContent>
      </Card>
    );
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Check if there are any warning flags
  const hasPricingWarning = product.warning_flags && product.warning_flags.price_below_cost;

  // Calculate profit margin
  const calculateProfitMargin = () => {
    if (!product.unit_price || !product.selling_price) return 0;
    const profit = product.selling_price - product.unit_price;
    const margin = (profit / product.selling_price) * 100;
    return margin.toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <div className="flex items-center gap-2 mt-1 text-gray-500">
            {product.sku && (
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <span>SKU: {product.sku}</span>
                {product.auto_generate_sku && (
                  <Badge variant="outline" className="ml-2 text-xs">Auto-generated</Badge>
                )}
              </div>
            )}
            <Badge className={getStatusBadgeColor(product.status || '')}>
              {product.status || 'Unknown'}
            </Badge>
          </div>
        </div>
        <Button 
          onClick={() => setIsEditing(true)}
          className="gap-2"
        >
          <Pencil className="h-4 w-4" />
          Edit Product
        </Button>
      </div>

      {hasPricingWarning && (
        <Alert variant="warning" className="bg-yellow-50 border-yellow-100">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Warning: The selling price ({product.selling_price}) is below the cost price ({product.unit_price}).
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {product.image_url ? (
              <div className="max-h-60 overflow-hidden rounded-md">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center">
                <Archive className="h-12 w-12 text-gray-400" />
              </div>
            )}

            {product.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                <p className="text-sm">{product.description}</p>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Category</h4>
              <p className="text-sm">{category?.name || 'Not assigned'}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Unit</h4>
              <p className="text-sm">{unit ? `${unit.name} (${unit.short_name})` : 'Not assigned'}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Brand</h4>
              <p className="text-sm">{brand?.name || 'Not assigned'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inventory Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
              <p className="text-sm">{location?.name || 'Not assigned'}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Warranty</h4>
              <p className="text-sm">
                {warranty ? `${warranty.name} (${warranty.duration} ${warranty.duration_unit})` : 'No warranty'}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Alert Quantity</h4>
              <p className="text-sm">{product.alert_quantity || 'Not set'}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Stock Status</h4>
              <div className="flex items-center gap-2">
                <Badge className={getStatusBadgeColor(product.status || '')}>
                  {product.status || 'Unknown'}
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Quantity Available</h4>
              <p className="text-sm font-medium">
                {product.quantity_available || 0}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Quantity Sold</h4>
              <p className="text-sm">{product.quantity_sold || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pricing & Composition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Pricing Information</h4>
              <div className="bg-gray-50 p-3 rounded-md space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cost Price</span>
                  <span className="font-medium">{product.unit_price || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Selling Price</span>
                  <span className={`font-medium ${hasPricingWarning ? 'text-red-600' : ''}`}>
                    {product.selling_price || 0}
                    {hasPricingWarning && <AlertTriangle className="inline h-3 w-3 ml-1" />}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm">Profit</span>
                  <span className={`font-medium ${hasPricingWarning ? 'text-red-600' : ''}`}>
                    {((product.selling_price || 0) - (product.unit_price || 0)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Margin</span>
                  <span className={`font-medium ${hasPricingWarning ? 'text-red-600' : ''}`}>
                    {calculateProfitMargin()}%
                  </span>
                </div>
              </div>
            </div>

            {product.has_consumables ? (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Consumable Item</h4>
                <div className="p-3 bg-purple-50 rounded-md">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Unit Price: {product.unit_price} | Available: {product.quantity_available}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {product.has_recipe && recipes.length > 0 ? (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Recipe Components</h4>
                    <div className="space-y-2">
                      {recipes.map((recipe: any) => (
                        <div key={recipe.id} className="p-2 bg-blue-50 rounded-md">
                          <div className="font-medium">
                            {recipe.ingredient?.name || 'Unknown Ingredient'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Quantity: {recipe.quantity} {recipe.unit?.short_name || ''} | Cost: {recipe.cost}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {product.has_consumables && consumables.length > 0 ? (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Required Consumables</h4>
                    <div className="space-y-2">
                      {consumables.map((consumable: any) => (
                        <div key={consumable.id} className="p-2 bg-purple-50 rounded-md">
                          <div className="font-medium">
                            {consumable.consumable?.name || 'Unknown Consumable'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Quantity: {consumable.quantity} {consumable.unit?.short_name || ''} | Cost: {consumable.cost}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            <Separator />

            <h4 className="text-sm font-medium text-gray-500">Pricing</h4>
            {product.business_product_sizes && product.business_product_sizes.length > 0 ? (
              <div className="space-y-2">
                {product.business_product_sizes.map((size: any) => (
                  <div key={size.id} className="flex justify-between items-center p-2 border rounded-md">
                    <span className="font-medium">{size.size_name}</span>
                    <Badge variant="outline">{size.price}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No size-based pricing available</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stock-history" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="stock-history">Stock History</TabsTrigger>
          <TabsTrigger value="activity-log">Activity Log</TabsTrigger>
        </TabsList>
        <TabsContent value="stock-history" className="rounded-md border p-4 mt-4">
          <h3 className="font-medium mb-4">Stock Transaction History</h3>
          <div className="text-center text-gray-500 py-6">
            <Package className="mx-auto h-10 w-10 text-gray-400 mb-2" />
            <p>Stock history will be displayed here</p>
          </div>
        </TabsContent>
        <TabsContent value="activity-log" className="rounded-md border p-4 mt-4">
          <h3 className="font-medium mb-4">Product Activity Log</h3>
          <div className="text-center text-gray-500 py-6">
            <Package className="mx-auto h-10 w-10 text-gray-400 mb-2" />
            <p>Activity log will be displayed here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetails;
