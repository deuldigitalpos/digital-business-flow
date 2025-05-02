
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StockStatusBadgeProps {
  quantity: number;
}

const StockStatusBadge: React.FC<StockStatusBadgeProps> = ({ quantity = 0 }) => {
  if (quantity <= 0) {
    return <Badge variant="destructive">Out of Stock</Badge>;
  } else if (quantity <= 10) {
    return <Badge variant="warning" className="bg-amber-500">Low Stock</Badge>;
  } else {
    return <Badge variant="success" className="bg-green-500">In Stock</Badge>;
  }
};

export default StockStatusBadge;
