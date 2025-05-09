import React, { useEffect, useState } from 'react';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import ProfileSettings from '@/components/shared/ProfileSettings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const BusinessProfileSettings = () => {
  const { businessUser, logout, updateBusinessUser } = useBusinessAuth();
  const [loading, setLoading] = useState(true);
  
  // Business user profile update function
  const handleBusinessProfileUpdate = async (profileData) => {
    try {
      const { error } = await supabase
        .from('business_users')
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          username: profileData.username,
          // Email can't be changed for business users in this implementation
          ...(profileData.avatar_url ? { avatar_url: profileData.avatar_url } : {})
        })
        .eq('id', businessUser.id);
        
      if (error) throw error;
      
      // Update local user data using the updateBusinessUser function
      updateBusinessUser({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        username: profileData.username,
        ...(profileData.avatar_url ? { avatar_url: profileData.avatar_url } : {})
      });
      
      return true;
    } catch (error) {
      console.error('Error updating business profile:', error);
      return false;
    }
  };
  
  // Business user password update function
  const handleBusinessPasswordUpdate = async (passwordData) => {
    try {
      // For security, verify current password first
      const { data: userData, error: verifyError } = await supabase
        .from('business_users')
        .select('*')
        .eq('id', businessUser.id)
        .eq('password', passwordData.current_password)
        .single();
        
      if (verifyError || !userData) {
        toast.error("Current password is incorrect");
        return false;
      }
      
      // Update password
      const { error } = await supabase
        .from('business_users')
        .update({ password: passwordData.new_password })
        .eq('id', businessUser.id);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating business password:', error);
      return false;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
      </div>
      
      {businessUser && (
        <ProfileSettings 
          user={businessUser}
          isBusinessUser={true} 
          onProfileUpdate={handleBusinessProfileUpdate}
          onPasswordUpdate={handleBusinessPasswordUpdate}
        />
      )}
    </div>
  );
};

export default BusinessProfileSettings;
