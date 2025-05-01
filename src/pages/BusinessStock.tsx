
import React, { useState } from 'react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import PermissionDenied from './PermissionDenied';
import StockTransactionForm from '@/components/business/StockTransactionForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRecentStockTransactions } from '@/hooks/useBusinessStockTransactions';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, ArrowUp, ArrowDown, Package, Utensils, ShoppingBag } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBusinessProducts } from '@/hooks/useBusinessProducts';
import { useBusinessIngredients } from '@/hooks/useBusinessIngredients';
import { useBusinessConsumables } from '@/hooks/useBusinessConsumables';
import { Badge } from '@/components/ui/badge';

const BusinessStock: React.FC = () => {
  const { hasPermission } = useBusinessAuth();
  const hasAccess = hasPermission('stock');
  const { data: recentTransactions, isLoading } = useRecentStockTransactions(10);
  const { data: products } = useBusinessProducts();
  const { data: ingredients } = useBusinessIngredients();
  const { data: consumables } = useBusinessConsumables();

  const [formKey, setFormKey] = useState(0);
  const [activeTab, setActiveTab] = useState('transactions');

  const handleSuccess = () => {
    // Reset the form by changing its key
    setFormKey(prev => prev + 1);
    // Show transactions tab after successful submission
    setActiveTab('transactions');
  };

  if (!hasAccess) {
    return <PermissionDenied />;
  }

  // Count low stock items
  const lowStockProducts = products?.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock')?.length || 0;
  const lowStockIngredients = ingredients?.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock')?.length || 0;
  const lowStockConsumables = consumables?.filter(c => c.status === 'Low Stock' || c.status === 'Out of Stock')?.length || 0;
  const totalLowStock = lowStockProducts + lowStockIngredients + lowStockConsumables;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return "bg-green-500";
      case 'Low Stock': return "bg-amber-500";
      case 'Out of Stock': return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stock Management</h1>
        <p className="text-muted-foreground">
          Update and track inventory levels for products, ingredients, and consumables
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="adjust">Adjust Stock</TabsTrigger>
          <TabsTrigger value="transactions">
            Recent Transactions
          </TabsTrigger>
          <TabsTrigger value="inventory" className="relative">
            Inventory Status
            {totalLowStock > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {totalLowStock}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="adjust" className="mt-4">
          <div className="max-w-md mx-auto">
            <StockTransactionForm key={formKey} onSuccess={handleSuccess} />
          </div>
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Stock Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : !recentTransactions || recentTransactions.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  <p>No recent transactions</p>
                  <button 
                    className="mt-4 text-primary underline"
                    onClick={() => setActiveTab('adjust')}
                  >
                    Make your first stock adjustment
                  </button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>When</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map(transaction => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.item_name}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {transaction.item_type === 'product' ? (
                            <span className="flex items-center">
                              <Package className="h-4 w-4 mr-1" />
                              Product
                            </span>
                          ) : transaction.item_type === 'ingredient' ? (
                            <span className="flex items-center">
                              <Utensils className="h-4 w-4 mr-1" />
                              Ingredient
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <ShoppingBag className="h-4 w-4 mr-1" />
                              Consumable
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {transaction.transaction_type === 'increase' ? (
                            <span className="flex items-center text-green-600">
                              <ArrowUp className="h-4 w-4 mr-1" />
                              {transaction.quantity}
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600">
                              <ArrowDown className="h-4 w-4 mr-1" />
                              {transaction.quantity}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{transaction.adjustment_reason || '-'}</TableCell>
                        <TableCell>{formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Products 
                  {lowStockProducts > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {lowStockProducts} Low
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {products?.length || 0} total products
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                {!products || products.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No products</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map(product => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.quantity_available}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(product.status)}>
                              {product.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Utensils className="h-5 w-5 mr-2" />
                  Ingredients
                  {lowStockIngredients > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {lowStockIngredients} Low
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {ingredients?.length || 0} total ingredients
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                {!ingredients || ingredients.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No ingredients</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ingredients.map(ingredient => (
                        <TableRow key={ingredient.id}>
                          <TableCell>{ingredient.name}</TableCell>
                          <TableCell>{ingredient.quantity_available}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(ingredient.status)}>
                              {ingredient.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Consumables */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Consumables
                  {lowStockConsumables > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {lowStockConsumables} Low
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {consumables?.length || 0} total consumables
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                {!consumables || consumables.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No consumables</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {consumables.map(consumable => (
                        <TableRow key={consumable.id}>
                          <TableCell>{consumable.name}</TableCell>
                          <TableCell>{consumable.quantity_available}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(consumable.status)}>
                              {consumable.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessStock;
