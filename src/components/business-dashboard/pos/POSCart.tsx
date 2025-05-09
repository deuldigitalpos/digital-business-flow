
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Package, Trash2, Plus, Minus, X } from 'lucide-react';
import { usePOSCart } from '@/hooks/usePOSCart';
import { formatCurrency } from '@/utils/format-currency';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const POSCart: React.FC = () => {
  const { 
    cartItems, 
    removeFromCart, 
    increaseQuantity, 
    decreaseQuantity, 
    clearCart,
    totalAmount
  } = usePOSCart();
  
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  
  const handleCheckout = () => {
    // Implement checkout functionality
    console.log("Checkout with:", { cartItems, customerName, paymentMethod, totalAmount });
    
    // Show a success message and clear the cart
    alert("Order completed successfully!");
    clearCart();
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Cart Header */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Shopping Cart
          </h2>
          {cartItems.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearCart}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>
      
      {/* Cart Items */}
      <ScrollArea className="flex-grow p-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>Your cart is empty</p>
            <p className="text-sm">Add products from the left panel</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium truncate" title={item.name}>
                          {item.name}
                        </h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500 hover:bg-red-50 -my-1"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <Badge variant="outline" className="text-xs">
                          ${item.selling_price.toFixed(2)}
                        </Badge>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            onClick={() => decreaseQuantity(item.id)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-2 w-6 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 rounded-full"
                            onClick={() => increaseQuantity(item.id)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-1">
                    <p className="font-medium text-green-600">
                      ${(item.selling_price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
      
      {/* Cart Summary */}
      <div className="border-t p-4 bg-gray-50">
        <div className="space-y-1 mb-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Subtotal</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Tax (0%)</span>
            <span>{formatCurrency(0)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span className="text-xl text-green-600">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>
        
        <Button 
          className="w-full bg-green-600 hover:bg-green-700 text-white" 
          size="lg"
          disabled={cartItems.length === 0}
          onClick={handleCheckout}
        >
          Process Payment
        </Button>
      </div>
    </div>
  );
};

export default POSCart;
