
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { BusinessRole } from '@/types/business-role';
import BusinessRoleList from '@/components/business/BusinessRoleList';
import AddBusinessRoleForm from '@/components/business/AddBusinessRoleForm';
import { useToast } from '@/components/ui/use-toast';

const BusinessRoleManager = () => {
  const { business } = useBusinessAuth();
  const { toast } = useToast();
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<BusinessRole | null>(null);

  // Using staleTime to prevent excessive refetches and improve loading performance
  const { data: roles, isLoading, error } = useQuery({
    queryKey: ['business-roles', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];

      try {
        const { data, error } = await supabase
          .from('business_roles')
          .select('*')
          .eq('business_id', business.id)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        return data as BusinessRole[];
      } catch (err) {
        console.error('Error fetching roles:', err);
        throw err;
      }
    },
    enabled: !!business?.id,
    staleTime: 30000, // 30 seconds stale time to improve performance
    retry: 1, // Limit retries to avoid excessive API calls
  });

  // Show error toast if fetching fails
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error loading roles",
        description: error instanceof Error ? error.message : "Failed to load roles",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const handleAddRole = () => {
    setSelectedRole(null);
    setShowAddRoleModal(true);
  };

  const handleEditRole = (role: BusinessRole) => {
    setSelectedRole(role);
    setShowAddRoleModal(true);
  };

  if (!business) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-muted-foreground">Please select a business first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Business Roles</h1>
        <Button
          onClick={handleAddRole}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" /> Add Role
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <BusinessRoleList 
              roles={roles || []} 
              onEdit={handleEditRole}
            />
          )}
        </CardContent>
      </Card>

      <AddBusinessRoleForm
        isOpen={showAddRoleModal}
        onClose={() => setShowAddRoleModal(false)}
        businessId={business.id}
        role={selectedRole}
      />
    </div>
  );
};

export default BusinessRoleManager;
