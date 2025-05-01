
import React, { useState } from 'react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import PermissionDenied from './PermissionDenied';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Filter, FileDown, FileUp } from 'lucide-react';
import ProductList from '@/components/business/ProductList';
import ProductForm from '@/components/business/ProductForm';
import { useLowStockProducts } from '@/hooks/useBusinessProducts';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const BusinessProducts: React.FC = () => {
  const { hasPermission } = useBusinessAuth();
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [activeTab, setActiveTab] = useState("all-products");
  const { data: lowStockProducts = [] } = useLowStockProducts();
  
  const hasAccess = hasPermission('products');

  if (!hasAccess) {
    return <PermissionDenied />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <div className="flex items-center gap-4">
          {!isAddingProduct && (
            <Button onClick={() => setIsAddingProduct(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          )}
        </div>
      </div>
      
      {/* Use Dialog instead of a Card for better mobile responsiveness */}
      <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <ProductForm onSuccess={() => setIsAddingProduct(false)} />
        </DialogContent>
      </Dialog>
      
      {!isAddingProduct && (
        <>
          <div className="bg-white rounded-lg shadow">
            <Tabs defaultValue="all-products" value={activeTab} onValueChange={setActiveTab}>
              <div className="px-4 pt-4">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="all-products">All Products</TabsTrigger>
                  <TabsTrigger 
                    value="low-stock"
                    className="relative"
                  >
                    Low Stock
                    {lowStockProducts.length > 0 && (
                      <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {lowStockProducts.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="expiring-soon">Expiring Soon</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="p-4">
                <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileDown className="h-4 w-4" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileUp className="h-4 w-4" />
                      Import
                    </Button>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <TabsContent value="all-products" className="mt-0">
                  <ProductList filter="all" />
                </TabsContent>
                
                <TabsContent value="low-stock" className="mt-0">
                  <ProductList filter="low-stock" />
                </TabsContent>
                
                <TabsContent value="expiring-soon" className="mt-0">
                  <ProductList filter="expiring" />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
};

export default BusinessProducts;
