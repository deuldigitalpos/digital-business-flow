
import React from 'react';
import SupplierManager from '@/components/business/SupplierManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

const BusinessSuppliers = () => {
  const { business } = useBusinessAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Supplier Management</h1>
        <p className="text-muted-foreground">
          Create and manage your business suppliers.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{business?.business_name} - Suppliers</CardTitle>
          <CardDescription>
            Add, edit, and manage your suppliers and view their transaction history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SupplierManager />
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessSuppliers;
