
import React, { useState } from 'react';
import useBusinessProducts from '@/hooks/useBusinessProducts';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBusinessCategories } from '@/hooks/useBusinessCategories';
import { usePOSCart } from '@/hooks/usePOSCart';
import { BusinessProduct } from '@/types/business-product';
import { ImageIcon } from 'lucide-react';

const POSProductGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  
  const { products, isLoading } = useBusinessProducts({ 
    search: searchQuery,
    category: categoryFilter
  });
  
  const categoryQuery = useBusinessCategories();
  const categories = categoryQuery.data || [];
  const { addToCart } = usePOSCart();
  
  const handleProductSelect = (product: BusinessProduct) => {
    addToCart(product);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow"
        />
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={undefined}>All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8">
          <p>No products found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleProductSelect(product)}
            >
              <CardContent className="p-4 flex flex-col items-center">
                <div className="w-full h-32 mb-3 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                
                <div className="w-full">
                  <h3 className="font-medium text-center mb-1 truncate" title={product.name}>
                    {product.name}
                  </h3>
                  <p className="text-center text-green-600 font-bold">
                    ${product.selling_price.toFixed(2)}
                  </p>
                  {product.quantity !== undefined && (
                    <p className="text-center text-sm text-gray-500">
                      {product.quantity > 0 ? `In Stock: ${product.quantity}` : 'Out of Stock'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default POSProductGrid;
