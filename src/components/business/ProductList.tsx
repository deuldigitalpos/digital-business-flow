
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBusinessProducts, useLowStockProducts, useExpiringProducts } from '@/hooks/useBusinessProducts';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash, AlertTriangle } from 'lucide-react';
import { useBusinessProductMutations } from '@/hooks/useBusinessProductMutations';

type ProductListProps = {
  filter?: 'all' | 'low-stock' | 'expiring';
};

const ProductList = ({ filter = 'all' }: ProductListProps) => {
  const navigate = useNavigate();
  const { data: allProducts = [], isLoading: isLoadingAll } = useBusinessProducts();
  const { data: lowStockProducts = [], isLoading: isLoadingLowStock } = useLowStockProducts();
  const { data: expiringProducts = [], isLoading: isLoadingExpiring } = useExpiringProducts();
  const { deleteProduct } = useBusinessProductMutations();

  // Determine which products to display based on the filter
  let products = allProducts;
  let isLoading = isLoadingAll;
  
  if (filter === 'low-stock') {
    products = lowStockProducts;
    isLoading = isLoadingLowStock;
  } else if (filter === 'expiring') {
    products = expiringProducts;
    isLoading = isLoadingExpiring;
  }

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

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

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading products...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-md p-6 text-center border">
        <p className="text-gray-500 mb-2">No products found</p>
        {filter !== 'all' && (
          <p className="text-sm text-gray-400">
            {filter === 'low-stock' 
              ? 'There are no products with low stock levels.' 
              : 'There are no products expiring soon.'}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const hasPricingWarning = product.warning_flags && product.warning_flags.price_below_cost;
            
            return (
              <TableRow 
                key={product.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => navigate(`/business-dashboard/products/${product.id}`)}
              >
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  {product.sku || '-'}
                  {product.auto_generate_sku && <span className="ml-1 text-xs text-gray-500">(Auto)</span>}
                </TableCell>
                <TableCell>{product.quantity_available}</TableCell>
                <TableCell>{product.unit_price}</TableCell>
                <TableCell className="relative">
                  {product.selling_price}
                  {hasPricingWarning && (
                    <AlertTriangle 
                      className="h-4 w-4 text-amber-500 inline-block ml-1" 
                      title="Selling price is below cost price"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(product.status || '')}>
                    {product.status || 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <div onClick={e => e.stopPropagation()} className="inline-flex">
                    <Button
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/business-dashboard/products/${product.id}`);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProduct(product.id);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductList;
