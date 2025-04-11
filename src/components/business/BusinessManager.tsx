
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddBusinessForm from '@/components/business/AddBusinessForm';
import BusinessList from '@/components/business/BusinessList';
import BusinessUserManager from '@/components/business/BusinessUserManager';
import EditBusinessForm from '@/components/business/EditBusinessForm';
import { useBusinessMutations } from '@/hooks/useBusinessMutations';
import { Business } from '@/types/business';

const BusinessManager = () => {
  const [showAddBusinessModal, setShowAddBusinessModal] = useState(false);
  const [showEditBusinessModal, setShowEditBusinessModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [activeTab, setActiveTab] = useState<string>("businesses");
  const queryClient = useQueryClient();
  
  const { deleteBusiness, toggleBusinessActive } = useBusinessMutations();

  const { data: businesses, isLoading: isLoadingBusinesses } = useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('businessdetails')
        .select('*')
        .order('business_name', { ascending: true });
      
      if (error) throw error;
      return data as Business[];
    },
  });

  useEffect(() => {
    if (!selectedBusiness && businesses && businesses.length > 0) {
      setSelectedBusiness(businesses[0]);
    }
  }, [businesses, selectedBusiness]);

  const handleBusinessSelect = (business: Business) => {
    setSelectedBusiness(business);
  };

  const handleEditBusiness = (business: Business) => {
    setSelectedBusiness(business);
    setShowEditBusinessModal(true);
  };

  const handleDeleteBusiness = (id: string) => {
    if (window.confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      deleteBusiness.mutate(id);
      if (selectedBusiness?.id === id) {
        setSelectedBusiness(null);
      }
    }
  };

  const handleManageBusiness = (business: Business) => {
    setSelectedBusiness(business);
    setActiveTab("users");
  };

  const handleAddSubscription = (business: Business) => {
    // This functionality is coming soon
  };

  const handleToggleActive = (business: Business, isActive: boolean) => {
    toggleBusinessActive.mutate({ business, isActive });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Business Management</h1>
        <Button
          onClick={() => setShowAddBusinessModal(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" /> Add Business
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="businesses">Businesses</TabsTrigger>
          {selectedBusiness && (
            <TabsTrigger value="users">Business Users</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="businesses" className="w-full">
          <Card>
            <BusinessList 
              businesses={businesses || []} 
              isLoading={isLoadingBusinesses} 
              onSelect={handleBusinessSelect}
              onEdit={handleEditBusiness}
              onDelete={handleDeleteBusiness}
              onManage={handleManageBusiness}
              onAddSubscription={handleAddSubscription}
              onToggleActive={handleToggleActive}
              selectedBusiness={selectedBusiness}
            />
          </Card>
        </TabsContent>
        
        {selectedBusiness && (
          <TabsContent value="users" className="w-full">
            <BusinessUserManager business={selectedBusiness} />
          </TabsContent>
        )}
      </Tabs>

      <AddBusinessForm
        isOpen={showAddBusinessModal}
        onClose={() => setShowAddBusinessModal(false)} 
      />
      
      {selectedBusiness && (
        <EditBusinessForm
          isOpen={showEditBusinessModal}
          onClose={() => setShowEditBusinessModal(false)}
          business={selectedBusiness}
        />
      )}
    </div>
  );
};

export default BusinessManager;
