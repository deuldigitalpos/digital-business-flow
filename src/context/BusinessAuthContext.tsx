import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BusinessUser } from '@/types/business-user';
import { Business } from '@/types/business';
import { supabase, setSupabaseBusinessAuth, clearSupabaseBusinessAuth } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BusinessRole, BusinessRolePermissions } from '@/types/business-role';
import { useNavigate } from 'react-router-dom';

type BusinessAuthContextType = {
  businessUser: BusinessUser | null;
  business: Business | null;
  isLoading: boolean;
  userPermissions: BusinessRolePermissions | null;
  hasPermission: (permission: string) => boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isDefaultUser: boolean;
};

const BusinessAuthContext = createContext<BusinessAuthContextType | undefined>(undefined);

export const useBusinessAuth = () => {
  const context = useContext(BusinessAuthContext);
  if (!context) {
    throw new Error('useBusinessAuth must be used within a BusinessAuthProvider');
  }
  return context;
};

export const BusinessAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [businessUser, setBusinessUser] = useState<BusinessUser | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [userPermissions, setUserPermissions] = useState<BusinessRolePermissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDefaultUser, setIsDefaultUser] = useState(false);
  const navigate = useNavigate();

  // Fetch business details as a memoized function to avoid recreating it on every render
  const fetchBusinessDetails = useCallback(async (businessId: string) => {
    try {
      console.log('Fetching business details for ID:', businessId);
      const { data, error } = await supabase
        .from('businessdetails')
        .select('*')
        .eq('id', businessId)
        .single();
        
      if (error) {
        console.error('Error fetching business details:', error);
        throw error;
      }
      
      if (data) {
        console.log('Business details fetched successfully');
        setBusiness(data as Business);
      }
    } catch (error) {
      console.error('Error in fetchBusinessDetails:', error);
    }
  }, []);

  // Check if this user is the default user for the business
  const checkIfDefaultUser = useCallback(async (userId: string, businessId: string) => {
    try {
      console.log('Checking if user is default user');
      
      // Query to find the first user created for this business
      const { data, error } = await supabase
        .from('business_users')
        .select('id')
        .eq('business_id', businessId)
        .order('created_at', { ascending: true })
        .limit(1);
      
      if (error) {
        console.error('Error checking default user:', error);
        setIsDefaultUser(false);
        return;
      }
      
      // If this user's ID matches the first user created for this business, they're the default
      if (data && data.length > 0) {
        const isDefault = data[0].id === userId;
        console.log('Is default user:', isDefault);
        setIsDefaultUser(isDefault);
      }
    } catch (error) {
      console.error('Error in checkIfDefaultUser:', error);
      setIsDefaultUser(false);
    }
  }, []);

  // Fetch user role permissions
  const fetchUserPermissions = useCallback(async (roleId: string | null) => {
    if (!roleId) {
      setUserPermissions({
        dashboard: true, // Default admin permissions if no role is assigned
        user_management: true,
        users: true,
        roles: true
      });
      return;
    }

    try {
      console.log('Fetching role permissions for role ID:', roleId);
      const { data, error } = await supabase
        .from('business_roles')
        .select('permissions')
        .eq('id', roleId)
        .single();

      if (error) {
        console.error('Error fetching role permissions:', error);
        setUserPermissions({
          dashboard: true // Fallback permissions
        });
        return;
      }

      if (data && data.permissions) {
        console.log('Role permissions fetched successfully:', data.permissions);
        setUserPermissions(data.permissions as BusinessRolePermissions);
      }
    } catch (error) {
      console.error('Error in fetchUserPermissions:', error);
      setUserPermissions({
        dashboard: true // Fallback permissions on error
      });
    }
  }, []);

  // Initial session check - runs only once
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing business auth...');
        const storedUser = localStorage.getItem('businessUser');
        
        if (!storedUser) {
          console.log('No stored business user found');
          setIsLoading(false);
          setIsInitialized(true);
          return;
        }

        try {
          console.log('Parsing stored business user');
          const parsedUser = JSON.parse(storedUser) as BusinessUser;
          setBusinessUser(parsedUser);
          
          // Set Supabase auth for the business user
          console.log('Setting Supabase auth for stored business user:', parsedUser.id);
          setSupabaseBusinessAuth(parsedUser.id);
          
          // Check if this is the default user for the business
          await checkIfDefaultUser(parsedUser.id, parsedUser.business_id);
          
          // Fetch user permissions based on role
          await fetchUserPermissions(parsedUser.role_id);
          
          // Fetch business details
          await fetchBusinessDetails(parsedUser.business_id);
        } catch (error) {
          console.error('Failed to parse stored business user:', error);
          localStorage.removeItem('businessUser');
          clearSupabaseBusinessAuth(); // Ensure Supabase auth is cleared on error
        }
      } catch (error) {
        console.error('Error during initialization:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
    
    // Clear auth on unmount
    return () => {
      clearSupabaseBusinessAuth();
    };
  }, [fetchBusinessDetails, fetchUserPermissions, checkIfDefaultUser]);

  // Optimized login function
  const login = async (username: string, password: string): Promise<boolean> => {
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return false;
    }

    setIsLoading(true);
    console.log('Attempting login for username:', username);
    
    try {
      // First clear any existing auth just to be safe
      clearSupabaseBusinessAuth();
      
      // Query the business_users table to find the user
      const { data, error } = await supabase
        .from('business_users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !data) {
        console.error('Login error:', error);
        toast.error('Invalid username or password');
        setIsLoading(false);
        return false;
      }

      const user = data as unknown as BusinessUser;
      console.log('Login successful, user found:', user.id);
      
      // Set user data and store it
      setBusinessUser(user);
      localStorage.setItem('businessUser', JSON.stringify(user));
      
      // IMPORTANT: Set Supabase auth for the business user
      console.log('Setting Supabase auth for user:', user.id);
      setSupabaseBusinessAuth(user.id);
      
      // Rest of login process
      await checkIfDefaultUser(user.id, user.business_id);
      await fetchUserPermissions(user.role_id);
      await fetchBusinessDetails(user.business_id);
      
      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(() => {
    setBusinessUser(null);
    setBusiness(null);
    setUserPermissions(null);
    setIsDefaultUser(false);
    localStorage.removeItem('businessUser');
    
    // IMPORTANT: Clear Supabase auth on logout
    clearSupabaseBusinessAuth();
    console.log('Supabase auth cleared on logout');
    
    navigate('/business-login');
    toast.info('Logged out successfully');
  }, [navigate]);

  // Derive authentication state from user data
  const isAuthenticated = !!businessUser;

  // Function to check if user has a specific permission
  const hasPermission = useCallback((permission: string): boolean => {
    // Default users have access to everything
    if (isDefaultUser) {
      console.log("Default user has ALL permissions, including:", permission);
      return true;
    }
    
    // Otherwise check specific permissions
    if (!userPermissions) {
      console.log("No permissions found for user");
      return false;
    }
    
    const hasSpecificPermission = !!userPermissions[permission];
    console.log(`Checking permission '${permission}':`, hasSpecificPermission, "Current permissions:", userPermissions);
    return hasSpecificPermission;
  }, [userPermissions, isDefaultUser]);

  return (
    <BusinessAuthContext.Provider 
      value={{ 
        businessUser, 
        business,
        userPermissions,
        hasPermission,
        isLoading: isLoading || !isInitialized, 
        login, 
        logout, 
        isAuthenticated,
        isDefaultUser
      }}
    >
      {children}
    </BusinessAuthContext.Provider>
  );
};
