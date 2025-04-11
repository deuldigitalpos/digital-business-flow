
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Building2, Users, Pencil, Trash2, FileCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddBusinessForm from '@/components/business/AddBusinessForm';
import BusinessList from '@/components/business/BusinessList';
import BusinessUserList from '@/components/business/BusinessUserList';
import AddBusinessUserForm from '@/components/business/AddBusinessUserForm';
import EditBusinessForm from '@/components/business/EditBusinessForm';
import { useToast } from '@/components/ui/use-toast';

interface Business {
  id: string;
  business_name: string;
  currency: string;
  country: string;
  website: string | null;
  logo_url: string | null;
  contact_number: string | null;
  created_at: string;
  updated_at: string;
}

interface BusinessUser {
  id: string;
  business_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role: string;
  created_at: string;
}

const BusinessManagement = () => {
  const [showAddBusinessModal, setShowAddBusinessModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditBusinessModal, setShowEditBusinessModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [selectedBusinessUser, setSelectedBusinessUser] = useState<BusinessUser | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch businesses
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

  // Fetch business users for selected business
  const { data: businessUsers, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['businessUsers', selectedBusiness?.id],
    queryFn: async () => {
      if (!selectedBusiness?.id) return [];
      
      const { data, error } = await supabase
        .from('business_users')
        .select('*')
        .eq('business_id', selectedBusiness.id)
        .order('first_name', { ascending: true });
      
      if (error) throw error;
      return data as BusinessUser[];
    },
    enabled: !!selectedBusiness?.id,
  });

  // Delete business mutation
  const deleteBusiness = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('businessdetails')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      toast({
        title: "Business deleted",
        description: "The business has been successfully removed."
      });
      if (selectedBusiness?.id === selectedBusiness?.id) {
        setSelectedBusiness(null);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete business: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Delete business user mutation
  const deleteBusinessUser = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('business_users')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessUsers', selectedBusiness?.id] });
      toast({
        title: "User deleted",
        description: "The user has been successfully removed."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete user: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Select first business if none selected and businesses are loaded
  useEffect(() => {
    if (!selectedBusiness && businesses && businesses.length > 0) {
      setSelectedBusiness(businesses[0]);
    }
  }, [businesses, selectedBusiness]);

  const handleBusinessSelect = (business: Business) => {
    setSelectedBusiness(business);
  };

  const handleBusinessUserSelect = (user: BusinessUser) => {
    setSelectedBusinessUser(user);
    setShowAddUserModal(true);
  };

  const handleEditBusiness = (business: Business) => {
    setSelectedBusiness(business);
    setShowEditBusinessModal(true);
  };

  const handleDeleteBusiness = (id: string) => {
    if (window.confirm('Are you sure you want to delete this business? This action cannot be undone.')) {
      deleteBusiness.mutate(id);
    }
  };

  const handleDeleteBusinessUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteBusinessUser.mutate(id);
    }
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

      <Tabs defaultValue="businesses" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="businesses" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" /> Businesses
          </TabsTrigger>
          {selectedBusiness && (
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Business Users
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="businesses" className="w-full">
          <Card>
            <CardHeader>
              <CardTitle>Businesses</CardTitle>
              <CardDescription>Manage your businesses</CardDescription>
            </CardHeader>
            <CardContent>
              <BusinessList 
                businesses={businesses || []} 
                isLoading={isLoadingBusinesses} 
                onSelect={handleBusinessSelect}
                onEdit={handleEditBusiness}
                onDelete={handleDeleteBusiness}
                selectedBusiness={selectedBusiness}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {selectedBusiness && (
          <TabsContent value="users" className="w-full">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Users for {selectedBusiness.business_name}</CardTitle>
                  <CardDescription>Manage users for this business</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setSelectedBusinessUser(null);
                    setShowAddUserModal(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" /> Add User
                </Button>
              </CardHeader>
              <CardContent>
                <BusinessUserList 
                  businessUsers={businessUsers || []}
                  isLoading={isLoadingUsers}
                  onEdit={handleBusinessUserSelect}
                  onDelete={handleDeleteBusinessUser}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Modals */}
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
      
      {selectedBusiness && (
        <AddBusinessUserForm
          isOpen={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          businessId={selectedBusiness.id}
          businessUser={selectedBusinessUser}
        />
      )}
    </div>
  );
};

export default BusinessManagement;
