
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBusinessProduct } from '@/hooks/useBusinessProducts';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ProductDetails from './ProductDetails';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useBusinessProduct(productId);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" className="gap-2" onClick={() => navigate('/business-dashboard/products')}>
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
        </div>
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" className="gap-2" onClick={() => navigate('/business-dashboard/products')}>
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Button>
        </div>
        <div className="bg-red-50 text-red-800 p-4 rounded-md">
          <p className="font-medium">Error loading product</p>
          <p className="text-sm">{error instanceof Error ? error.message : 'Product not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" className="gap-2" onClick={() => navigate('/business-dashboard/products')}>
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>
      </div>
      
      <ProductDetails productId={product.id} />
    </div>
  );
};

export default ProductDetailPage;
