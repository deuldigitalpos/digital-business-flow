
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BusinessUser } from '@/types/business-user';
import { Business } from '@/types/business';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type BusinessAuthContextType = {
  businessUser: BusinessUser | null;
  business: Business | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
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
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

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
          
          // Fetch business details
          await fetchBusinessDetails(parsedUser.business_id);
        } catch (error) {
          console.error('Failed to parse stored business user:', error);
          localStorage.removeItem('businessUser');
        }
      } catch (error) {
        console.error('Error during initialization:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [fetchBusinessDetails]);

  // Optimized login function
  const login = async (username: string, password: string): Promise<boolean> => {
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return false;
    }

    setIsLoading(true);
    console.log('Attempting login for username:', username);
    
    try {
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
      
      // Store user data first
      setBusinessUser(user);
      localStorage.setItem('businessUser', JSON.stringify(user));
      
      // Then fetch business details
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
    localStorage.removeItem('businessUser');
    toast.info('Logged out successfully');
  }, []);

  // Derive authentication state from user data
  const isAuthenticated = !!businessUser;

  return (
    <BusinessAuthContext.Provider 
      value={{ 
        businessUser, 
        business, 
        isLoading: isLoading || !isInitialized, 
        login, 
        logout, 
        isAuthenticated
      }}
    >
      {children}
    </BusinessAuthContext.Provider>
  );
};
