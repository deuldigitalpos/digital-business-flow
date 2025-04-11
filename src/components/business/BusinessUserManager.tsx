
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import BusinessUserList from '@/components/business/BusinessUserList';
import AddBusinessUserForm from '@/components/business/AddBusinessUserForm';
import { useBusinessUserMutations } from '@/hooks/useBusinessUserMutations';
import { Business } from '@/types/business';
import { BusinessUser } from '@/types/business-user';
import BusinessDetails from '@/components/business/BusinessDetails';

interface BusinessUserManagerProps {
  business: Business;
}

const BusinessUserManager: React.FC<BusinessUserManagerProps> = ({ business }) => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedBusinessUser, setSelectedBusinessUser] = useState<BusinessUser | null>(null);
  
  const { deleteBusinessUser } = useBusinessUserMutations();

  const { data: businessUsers, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['businessUsers', business.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_users')
        .select('*')
        .eq('business_id', business.id)
        .order('first_name', { ascending: true });
      
      if (error) throw error;
      return data as BusinessUser[];
    },
    enabled: !!business.id,
  });

  const handleBusinessUserSelect = (user: BusinessUser) => {
    setSelectedBusinessUser(user);
    setShowAddUserModal(true);
  };

  const handleDeleteBusinessUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteBusinessUser.mutate(id);
    }
  };

  return (
    <>
      <BusinessDetails business={business} />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Users for {business.business_name}</CardTitle>
            <CardDescription>Manage users for this business</CardDescription>
          </div>
          <Button
            onClick={() => {
              setSelectedBusinessUser(null);
              setShowAddUserModal(true);
            }}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" /> Add User
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
      
      <AddBusinessUserForm
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        businessId={business.id}
        businessUser={selectedBusinessUser}
      />
    </>
  );
};

export default BusinessUserManager;
