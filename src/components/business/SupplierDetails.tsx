
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BusinessSupplier } from '@/types/business-supplier';

interface SupplierDetailsProps {
  supplier: BusinessSupplier;
}

const SupplierDetails: React.FC<SupplierDetailsProps> = ({ supplier }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 border-green-300 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-100 border-gray-300 text-gray-800">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="outline" className="bg-yellow-100 border-yellow-300 text-yellow-800">Suspended</Badge>;
      case 'blocked':
        return <Badge variant="outline" className="bg-red-100 border-red-300 text-red-800">Blocked</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-blue-100 border-blue-300 text-blue-800">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                {supplier.first_name} {supplier.last_name}
              </h2>
              {supplier.business_name && (
                <p className="text-muted-foreground">{supplier.business_name}</p>
              )}
            </div>
            <div>{getStatusBadge(supplier.account_status)}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Supplier ID</p>
              <p>{supplier.supplier_id || '—'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{supplier.email || '—'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Mobile Number</p>
              <p>{supplier.mobile_number || '—'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">TIN Number</p>
              <p>{supplier.tin_number || '—'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Credit Limit</p>
              <p>{supplier.credit_limit?.toLocaleString() || '—'}</p>
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <p className="text-sm font-medium text-muted-foreground">Address</p>
            <p className="whitespace-pre-wrap">{supplier.address || '—'}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-muted/50 rounded-lg p-4 mt-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Purchase</p>
              <p>{supplier.total_purchase?.toLocaleString() || '0'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
              <p>{supplier.total_invoices?.toLocaleString() || '0'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Invoices Due</p>
              <p>{supplier.total_invoices_due?.toLocaleString() || '0'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Amount Due</p>
              <p>{supplier.total_amount_invoices_due?.toLocaleString() || '0'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Return Due</p>
              <p>{supplier.total_purchase_return_due?.toLocaleString() || '0'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p>{new Date(supplier.created_at).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p>{new Date(supplier.updated_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierDetails;
