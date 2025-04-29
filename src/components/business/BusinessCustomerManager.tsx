
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Business } from '@/types/business';
import { Loader2, UserPlus, FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import CustomerList from '@/components/business/CustomerList';
import AddCustomerForm from '@/components/business/AddCustomerForm';
import EditCustomerForm from '@/components/business/EditCustomerForm';
import { BusinessCustomer } from '@/types/business-customer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CustomerDetails from '@/components/business/CustomerDetails';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

interface BusinessCustomerManagerProps {
  business: Business | null;
}

const BusinessCustomerManager: React.FC<BusinessCustomerManagerProps> = ({ business }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<BusinessCustomer | null>(null);
  
  // Fetch customers
  const { data: customers, isLoading, error } = useQuery({
    queryKey: ['business-customers', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      
      const { data, error } = await supabase
        .from('business_customers')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw new Error(error.message);
      }
      
      return data as BusinessCustomer[];
    },
    enabled: !!business?.id
  });
  
  // Filter customers based on search query
  const filteredCustomers = React.useMemo(() => {
    if (!customers) return [];
    if (!searchQuery.trim()) return customers;
    
    const lowerCaseQuery = searchQuery.toLowerCase().trim();
    return customers.filter(customer => 
      customer.first_name.toLowerCase().includes(lowerCaseQuery) ||
      customer.last_name.toLowerCase().includes(lowerCaseQuery) ||
      (customer.customer_id && customer.customer_id.toLowerCase().includes(lowerCaseQuery)) ||
      (customer.email && customer.email.toLowerCase().includes(lowerCaseQuery)) ||
      (customer.business_name && customer.business_name.toLowerCase().includes(lowerCaseQuery))
    );
  }, [customers, searchQuery]);

  // Handle view customer
  const handleViewCustomer = (customer: BusinessCustomer) => {
    setSelectedCustomer(customer);
    setIsViewDialogOpen(true);
  };

  // Handle edit customer
  const handleEditCustomer = (customer: BusinessCustomer) => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-lg">Loading customers...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500 font-medium">Error loading customers:</div>
          <div className="mt-2">{error.message}</div>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
            <p className="text-muted-foreground">
              Manage your business customers and track their activities.
            </p>
          </div>
          
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button 
              onClick={() => setIsAddDialogOpen(true)} 
              className="gap-2"
              variant="default"
            >
              <UserPlus className="h-4 w-4" />
              Add Customer
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Customer List */}
        <CustomerList 
          customers={filteredCustomers} 
          businessId={business?.id || ''}
          onViewCustomer={handleViewCustomer}
          onEditCustomer={handleEditCustomer}
        />
      </div>

      {/* Add Customer Dialog - Available to all users who can access this page */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Enter the customer details below to add a new customer.
            </DialogDescription>
          </DialogHeader>
          <AddCustomerForm 
            businessId={business?.id || ''} 
            onSuccess={() => setIsAddDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update the customer details.
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <EditCustomerForm 
              customer={selectedCustomer} 
              onSuccess={() => setIsEditDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Customer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <CustomerDetails customer={selectedCustomer} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BusinessCustomerManager;
