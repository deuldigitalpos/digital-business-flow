
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BusinessProduct } from "@/types/business-product";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useProductIngredients from "@/hooks/useProductIngredients";
import useProductConsumables from "@/hooks/useProductConsumables";
import useProductSizes from "@/hooks/useProductSizes";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ImageIcon } from "lucide-react";

interface ViewProductModalProps {
  product: BusinessProduct;
  isOpen: boolean;
  onClose: () => void;
}

const ViewProductModal: React.FC<ViewProductModalProps> = ({ product, isOpen, onClose }) => {
  const { ingredients } = useProductIngredients(product?.id);
  const { consumables } = useProductConsumables(product?.id);
  const { sizes } = useProductSizes(product?.id);
  
  const getStockStatusBadge = (status?: string) => {
    switch (status) {
      case 'In Stock':
        return <Badge className="bg-green-500">In Stock</Badge>;
      case 'Low Stock':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Low Stock</Badge>;
      default:
        return <Badge variant="destructive">Out of Stock</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Product Details: {product.name}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {product.has_ingredients && (
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            )}
            {product.has_consumables && (
              <TabsTrigger value="consumables">Consumables</TabsTrigger>
            )}
            {product.has_sizes && (
              <TabsTrigger value="sizes">Sizes</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-auto rounded-md object-cover" 
                  />
                ) : (
                  <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center">
                    <ImageIcon className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="w-full md:w-2/3 space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-muted-foreground">Product ID:</dt>
                        <dd>{product.product_id || '-'}</dd>
                      </div>
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-muted-foreground">SKU:</dt>
                        <dd>{product.sku || '-'}</dd>
                      </div>
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-muted-foreground">Category:</dt>
                        <dd>{product.category?.name || '-'}</dd>
                      </div>
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-muted-foreground">Unit:</dt>
                        <dd>{product.unit?.name || '-'}</dd>
                      </div>
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-muted-foreground">Brand:</dt>
                        <dd>{product.brand?.name || '-'}</dd>
                      </div>
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-muted-foreground">Warranty:</dt>
                        <dd>{product.warranty?.name || '-'}</dd>
                      </div>
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-muted-foreground">Created on:</dt>
                        <dd>{format(new Date(product.created_at), 'MMM d, yyyy')}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">Stock Information</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-muted-foreground">Quantity Available:</dt>
                        <dd>{product.quantity || 0}</dd>
                      </div>
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-muted-foreground">Stock Status:</dt>
                        <dd>{getStockStatusBadge(product.stock_status)}</dd>
                      </div>
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-muted-foreground">Total Sales:</dt>
                        <dd>{product.total_sales || 0} units</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">Pricing Information</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-muted-foreground">Cost Price:</dt>
                        <dd>${product.cost_price.toFixed(2)}</dd>
                      </div>
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-muted-foreground">Selling Price:</dt>
                        <dd>${product.selling_price.toFixed(2)}</dd>
                      </div>
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-muted-foreground">Cost Margin:</dt>
                        <dd>${(product.selling_price - product.cost_price).toFixed(2)}</dd>
                      </div>
                      <div className="flex justify-between md:block">
                        <dt className="font-medium text-muted-foreground">Profit Margin:</dt>
                        <dd>
                          {product.cost_price > 0 ? 
                            `${(((product.selling_price - product.cost_price) / product.cost_price) * 100).toFixed(2)}%` : 
                            'N/A'}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                {product.description && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-sm">{product.description}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          {product.has_ingredients && (
            <TabsContent value="ingredients">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Ingredients Breakdown</h3>
                  {ingredients.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ingredient</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead className="text-right">Cost</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ingredients.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.ingredient?.name || 'Unknown'}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>
                              {item.unit?.short_name || item.ingredient?.unit?.short_name || '-'}
                            </TableCell>
                            <TableCell className="text-right">${item.cost.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} className="font-medium">Total Ingredient Cost</TableCell>
                          <TableCell className="text-right font-medium">
                            ${ingredients.reduce((sum, item) => sum + item.cost, 0).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground">No ingredients added to this product.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
          
          {product.has_consumables && (
            <TabsContent value="consumables">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Consumables Breakdown</h3>
                  {consumables.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Consumable</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead className="text-right">Cost</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {consumables.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.consumable?.name || 'Unknown'}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>
                              {item.unit?.short_name || item.consumable?.unit?.short_name || '-'}
                            </TableCell>
                            <TableCell className="text-right">${item.cost.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} className="font-medium">Total Consumable Cost</TableCell>
                          <TableCell className="text-right font-medium">
                            ${consumables.reduce((sum, item) => sum + item.cost, 0).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground">No consumables added to this product.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
          
          {product.has_sizes && (
            <TabsContent value="sizes">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">Size Variants</h3>
                  {sizes.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Size Name</TableHead>
                          <TableHead className="text-right">Additional Price</TableHead>
                          <TableHead className="text-right">Total Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sizes.map((size) => (
                          <TableRow key={size.id}>
                            <TableCell>{size.name}</TableCell>
                            <TableCell className="text-right">${size.additional_price.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              ${(product.selling_price + size.additional_price).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground">No size variants added to this product.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ViewProductModal;
