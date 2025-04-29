
import React from 'react';
import { BusinessSupplier } from '@/types/business-supplier';

interface SupplierDetailsProps {
  supplier: BusinessSupplier;
}

const SupplierDetails: React.FC<SupplierDetailsProps> = ({ supplier }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Supplier ID</h4>
          <p className="text-lg">{supplier.supplier_id || '—'}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
          <p className="text-lg capitalize">{supplier.account_status}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">First Name</h4>
          <p className="text-lg">{supplier.first_name}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Last Name</h4>
          <p className="text-lg">{supplier.last_name}</p>
        </div>
      </div>
      
      {supplier.business_name && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Business Name</h4>
          <p className="text-lg">{supplier.business_name}</p>
        </div>
      )}
      
      {supplier.email && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
          <p className="text-lg">{supplier.email}</p>
        </div>
      )}
      
      {supplier.mobile_number && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
          <p className="text-lg">{supplier.mobile_number}</p>
        </div>
      )}
      
      {supplier.tin_number && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">TIN Number</h4>
          <p className="text-lg">{supplier.tin_number}</p>
        </div>
      )}
      
      {supplier.address && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
          <p className="text-lg">{supplier.address}</p>
        </div>
      )}
      
      {supplier.credit_limit !== null && (
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Credit Limit</h4>
          <p className="text-lg">{supplier.credit_limit.toLocaleString()}</p>
        </div>
      )}
      
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-3">Financial Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Total Purchase</h4>
            <p className="text-lg">{supplier.total_purchase?.toLocaleString() || '0'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Total Invoices</h4>
            <p className="text-lg">{supplier.total_invoices?.toLocaleString() || '0'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Invoices Due</h4>
            <p className="text-lg">{supplier.total_invoices_due?.toLocaleString() || '0'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Amount Due</h4>
            <p className="text-lg">{supplier.total_amount_invoices_due?.toLocaleString() || '0'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Return Due</h4>
            <p className="text-lg">{supplier.total_purchase_return_due?.toLocaleString() || '0'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetails;
