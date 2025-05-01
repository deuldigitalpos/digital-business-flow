
import React, { useState } from 'react';
import { useBusinessProducts, useLowStockProducts, useExpiringProducts } from '@/hooks/useBusinessProducts';
import { BusinessProduct } from '@/types/business-product';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, AlertCircle, Archive } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useBusinessProductMutations } from '@/hooks/useBusinessProductMutations';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ProductForm from './ProductForm';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ProductListProps {
  filter: 'all' | 'low-stock' | 'expiring';
}

const ProductList: React.FC<ProductListProps> = ({ filter }) => {
  const { data: allProducts, isLoading: isLoadingAll } = useBusinessProducts();
  const { data: lowStockProducts, isLoading: isLoadingLow } = useLowStockProducts();
  const { data: expiringProducts, isLoading: isLoadingExpiring } = useExpiringProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<BusinessProduct | null>(null);
  const [productToDelete, setProductToDelete] = useState<BusinessProduct | null>(null);
  const { deleteProduct } = useBusinessProductMutations();

  let products: BusinessProduct[] = [];
  let isLoading = false;

  // Select products based on filter
  switch (filter) {
    case 'low-stock':
      products = lowStockProducts || [];
      isLoading = isLoadingLow;
      break;
    case 'expiring':
      products = expiringProducts || [];
      isLoading = isLoadingExpiring;
      break;
    default:
      products = allProducts || [];
      isLoading = isLoadingAll;
  }

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.sku?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteProduct.mutateAsync(productToDelete.id);
      toast.success(`${productToDelete.name} deleted successfully`);
      setProductToDelete(null);
    } catch (error) {
      toast.error(`Failed to delete product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading products...</div>;
  }

  return (
    <>
      <div className="mb-4">
        <Input
          placeholder="Search products by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-40">
            <Archive className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-lg text-gray-500">No products found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {product.image_url ? (
                        <div className="h-10 w-10 rounded overflow-hidden">
                          <img 
                            src={product.image_url} 
                            alt={product.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                          <Archive className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <div>{product.name}</div>
                        {product.expiration_date && (
                          <div className="text-xs text-gray-500">
                            Expires: {format(new Date(product.expiration_date), 'MMM d, yyyy')}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.sku || '-'}</TableCell>
                  <TableCell>{product.category_id ? 'Category' : '-'}</TableCell>
                  <TableCell>{product.brand_id ? 'Brand' : '-'}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusBadgeColor(product.status || '')}`}>
                      {product.status || 'Unknown'}
                    </Badge>
                    {product.is_raw_ingredient && (
                      <Badge className="bg-blue-100 text-blue-800 ml-1">Ingredient</Badge>
                    )}
                    {product.is_consumable && (
                      <Badge className="bg-purple-100 text-purple-800 ml-1">Consumable</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className={product.quantity_available && product.quantity_available <= 0 ? 'text-red-500' : ''}>
                      {product.quantity_available || 0}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setProductToDelete(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to product details below.
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <ProductForm 
              product={editingProduct} 
              onSuccess={() => setEditingProduct(null)} 
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {productToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductList;
