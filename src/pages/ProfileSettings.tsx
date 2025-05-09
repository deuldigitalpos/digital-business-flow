import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProfileSettings from '@/components/shared/ProfileSettings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ProfileSettingsPage = () => {
  const { user, logout, updateUser } = useAuth();
  
  // Admin profile update function
  const handleAdminProfileUpdate = async (profileData) => {
    try {
      const { error } = await supabase
        .from('adminuser')
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          username: profileData.username,
          // Don't update email in this implementation
          ...(profileData.avatar_url ? { avatar_url: profileData.avatar_url } : {})
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local user data using the updateUser function
      updateUser({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        username: profileData.username,
        ...(profileData.avatar_url ? { avatar_url: profileData.avatar_url } : {})
      });
      
      return true;
    } catch (error) {
      console.error('Error updating admin profile:', error);
      return false;
    }
  };
  
  // Admin password update function
  const handleAdminPasswordUpdate = async (passwordData) => {
    try {
      // For security, verify current password first
      const { data: userData, error: verifyError } = await supabase
        .from('adminuser')
        .select('*')
        .eq('id', user.id)
        .eq('password', passwordData.current_password)
        .single();
        
      if (verifyError || !userData) {
        toast.error("Current password is incorrect");
        return false;
      }
      
      // Update password
      const { error } = await supabase
        .from('adminuser')
        .update({ password: passwordData.new_password })
        .eq('id', user.id);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating admin password:', error);
      return false;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
      </div>
      
      {user && (
        <ProfileSettings 
          user={user} 
          onProfileUpdate={handleAdminProfileUpdate}
          onPasswordUpdate={handleAdminPasswordUpdate}
        />
      )}
    </div>
  );
};

export default ProfileSettingsPage;
