
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, DollarSign, Boxes } from "lucide-react";
import useBusinessProducts from "@/hooks/useBusinessProducts";

const ProductsSummary = () => {
  const { products, isLoading } = useBusinessProducts();
  
  // Calculate summary statistics
  const totalProducts = products.length;
  
  const totalQuantity = products.reduce((total, product) => {
    return total + (product.quantity || 0);
  }, 0);
  
  const totalSales = products.reduce((total, product) => {
    return total + (product.total_sales || 0);
  }, 0);
  
  const stockValue = products.reduce((total, product) => {
    return total + ((product.quantity || 0) * product.cost_price);
  }, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "..." : totalProducts}</div>
          <p className="text-xs text-muted-foreground">Product variants in your catalog</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
          <Boxes className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "..." : totalQuantity.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Units available in stock</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "..." : totalSales.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Units sold to date</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${isLoading ? "..." : stockValue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Total inventory value</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsSummary;
