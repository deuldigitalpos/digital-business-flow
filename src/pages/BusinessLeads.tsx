
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { Loader2, ShieldAlert, UserPlus, Search } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { BusinessCustomer } from '@/types/business-customer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CustomerList from '@/components/business/CustomerList';
import AddCustomerForm from '@/components/business/AddCustomerForm';

const BusinessLeads = () => {
  const { business, isLoading, hasPermission } = useBusinessAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Simple error boundary state
  const [hasError, setHasError] = React.useState(false);
  
  // Reset error state on mount
  React.useEffect(() => {
    setHasError(false);
  }, []);
  
  // Error boundary wrapper
  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="text-red-500 text-lg font-medium">
          Something went wrong loading the leads page.
        </div>
        <button
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          onClick={() => {
            setHasError(false);
            window.location.reload();
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-lg">Loading business leads...</span>
      </div>
    );
  }
  
  // Check for view permission but still show the page with limited content
  const canViewCustomers = hasPermission('customers');
  
  if (!canViewCustomers) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-orange-500" />
            Limited Access
          </CardTitle>
          <CardDescription>
            You have limited permissions for the Leads section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You don't have permission to manage leads.
            Contact your administrator for access.
          </p>
          
          {business && (
            <div className="mt-6 p-4 bg-muted/30 rounded-md">
              <h3 className="font-medium text-lg">{business.business_name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {business.country} • {business.currency}
              </p>
              {business.contact_number && (
                <p className="text-sm mt-2">Contact: {business.contact_number}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Fetch leads (customers with is_lead=true)
  const { data: leads, isLoading: isLeadsLoading, error } = useQuery({
    queryKey: ['business-leads', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      
      const { data, error } = await supabase
        .from('business_customers')
        .select('*')
        .eq('business_id', business.id)
        .eq('is_lead', true)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw new Error(error.message);
      }
      
      return data as BusinessCustomer[];
    },
    enabled: !!business?.id
  });

  // Filter leads based on search query
  const filteredLeads = React.useMemo(() => {
    if (!leads) return [];
    if (!searchQuery.trim()) return leads;
    
    const lowerCaseQuery = searchQuery.toLowerCase().trim();
    return leads.filter(lead => 
      lead.first_name.toLowerCase().includes(lowerCaseQuery) ||
      lead.last_name.toLowerCase().includes(lowerCaseQuery) ||
      (lead.customer_id && lead.customer_id.toLowerCase().includes(lowerCaseQuery)) ||
      (lead.email && lead.email.toLowerCase().includes(lowerCaseQuery)) ||
      (lead.business_name && lead.business_name.toLowerCase().includes(lowerCaseQuery))
    );
  }, [leads, searchQuery]);

  if (isLeadsLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-lg">Loading leads...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500 font-medium">Error loading leads:</div>
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
            <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
            <p className="text-muted-foreground">
              Manage your business leads and track their activities.
            </p>
          </div>
          
          <Button 
            onClick={() => setIsAddDialogOpen(true)} 
            className="gap-2"
            variant="default"
          >
            <UserPlus className="h-4 w-4" />
            Add New Lead
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Lead List */}
        <CustomerList 
          customers={filteredLeads} 
          businessId={business?.id || ''}
          onViewCustomer={() => {}}
          onEditCustomer={() => {}}
        />
      </div>

      {/* Add Lead Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription>
              Enter the lead details below to add a new potential customer.
            </DialogDescription>
          </DialogHeader>
          <AddCustomerForm 
            businessId={business?.id || ''} 
            onSuccess={() => setIsAddDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BusinessLeads;
