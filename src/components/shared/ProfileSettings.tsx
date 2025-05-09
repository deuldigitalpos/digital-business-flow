
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCog, Camera, Save, Check } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Form schema for validation
const profileFormSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
});

const passwordFormSchema = z.object({
  current_password: z.string().min(6, 'Current password is required'),
  new_password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

interface ProfileSettingsProps {
  user: any; // User data
  isBusinessUser?: boolean;
  onProfileUpdate: (data: any) => Promise<boolean>;
  onPasswordUpdate?: (data: any) => Promise<boolean>;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ 
  user, 
  isBusinessUser = false,
  onProfileUpdate,
  onPasswordUpdate
}) => {
  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const isMobile = useIsMobile();

  // Initialize profile form with user data
  const profileForm = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      username: user?.username || '',
      email: user?.email || '',
    },
  });

  // Initialize password form
  const passwordForm = useForm({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        username: user.username || '',
        email: user.email || '',
      });
      
      // Set avatar if available
      if (user.avatar_url) {
        setAvatar(user.avatar_url);
      }
    }
  }, [user, profileForm]);

  // Handle profile image upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      setUploading(true);
      
      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
        
      if (publicUrlData?.publicUrl) {
        const avatarUrl = publicUrlData.publicUrl;
        setAvatar(avatarUrl);
        
        // Add the avatar_url to the profile update
        await onProfileUpdate({ avatar_url: avatarUrl });
        
        toast.success("Profile picture updated");
      }
    } catch (error) {
      toast.error(`Error uploading avatar: ${error.message}`);
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  // Handle profile form submission
  const handleProfileSubmit = async (data) => {
    try {
      setIsUpdating(true);
      const success = await onProfileUpdate(data);
      
      if (success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error(`Error updating profile: ${error.message}`);
      console.error('Error updating profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle password form submission
  const handlePasswordSubmit = async (data) => {
    if (!onPasswordUpdate) {
      toast.error("Password change not supported for this user type");
      return;
    }
    
    try {
      setIsChangingPassword(true);
      const success = await onPasswordUpdate({
        current_password: data.current_password,
        new_password: data.new_password
      });
      
      if (success) {
        toast.success("Password changed successfully");
        passwordForm.reset();
      } else {
        toast.error("Failed to change password");
      }
    } catch (error) {
      toast.error(`Error changing password: ${error.message}`);
      console.error('Error changing password:', error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    const firstName = user?.first_name || '';
    const lastName = user?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} mb-6`}>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        {!isMobile && <TabsTrigger value="preferences">Preferences</TabsTrigger>}
      </TabsList>
      
      <TabsContent value="profile" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCog className="mr-2 h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details and profile picture.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar section */}
            <div className="flex flex-col items-center space-y-4 mb-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatar} alt={user?.username} />
                <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
              </Avatar>
              
              <div className="relative">
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <Button 
                  asChild 
                  size="sm" 
                  variant="outline"
                  disabled={uploading}
                >
                  <label htmlFor="avatar" className="cursor-pointer">
                    {uploading ? (
                      'Uploading...'
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        Change Photo
                      </>
                    )}
                  </label>
                </Button>
              </div>
            </div>
            
            {/* Profile form */}
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={profileForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={isBusinessUser} type="email" />
                      </FormControl>
                      {isBusinessUser && (
                        <p className="text-sm text-muted-foreground">
                          Contact an admin to change your email address.
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full md:w-auto"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    'Updating...'
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="security" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="current_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="preferences" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Manage your notification settings and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Preferences settings will be implemented soon.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ProfileSettings;
