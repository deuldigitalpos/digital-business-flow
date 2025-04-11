
import React, { createContext, useContext, useState, useEffect } from 'react';
import { BusinessUser } from '@/types/business-user';
import { Business } from '@/types/business';
import { supabase } from '@/integrations/supabase/client';

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

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('businessUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as BusinessUser;
        setBusinessUser(parsedUser);
        
        // Fetch the business details
        fetchBusinessDetails(parsedUser.business_id);
      } catch (error) {
        console.error('Failed to parse stored business user:', error);
        localStorage.removeItem('businessUser');
      }
    }
    setIsLoading(false);
  }, []);

  const fetchBusinessDetails = async (businessId: string) => {
    try {
      const { data, error } = await supabase
        .from('businessdetails')
        .select('*')
        .eq('id', businessId)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setBusiness(data as Business);
      }
    } catch (error) {
      console.error('Error fetching business details:', error);
    }
  };

  // Login function that checks credentials against business_users table
  const login = async (username: string, password: string): Promise<boolean> => {
    if (!username || !password) {
      return false;
    }

    try {
      // Query the business_users table to find the user
      const { data, error } = await supabase
        .from('business_users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error) {
        return false;
      }

      if (data) {
        const user = data as unknown as BusinessUser;
        setBusinessUser(user);
        localStorage.setItem('businessUser', JSON.stringify(user));
        
        // Fetch the business details
        await fetchBusinessDetails(user.business_id);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setBusinessUser(null);
    setBusiness(null);
    localStorage.removeItem('businessUser');
  };

  return (
    <BusinessAuthContext.Provider 
      value={{ 
        businessUser, 
        business, 
        isLoading, 
        login, 
        logout, 
        isAuthenticated: !!businessUser 
      }}
    >
      {children}
    </BusinessAuthContext.Provider>
  );
};
