
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { Database } from '@/integrations/supabase/types';

// Define user types with all required properties
type User = {
  username: string;
  isAdmin: boolean;
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
  status?: string;
  role?: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void; // Add updateUser function
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Function to update user data
  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Login function that checks credentials against adminuser table
  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple validation
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return false;
    }

    try {
      console.log(`Attempting login with username: ${username}`);
      
      // Query the adminuser table directly
      const { data, error } = await supabase
        .from('adminuser')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .eq('status', 'active')
        .single();

      if (error) {
        console.error('Login error:', error);
        toast.error('Invalid username or password');
        return false;
      }

      if (data) {
        const adminUser = data as unknown as any; // Use any for now
        console.log('Login successful for user:', adminUser);
        
        // Create a user object for the client with all required properties
        const userData: User = {
          username: adminUser.username,
          isAdmin: adminUser.role?.toLowerCase() === 'admin',
          id: adminUser.id,
          first_name: adminUser.first_name,
          last_name: adminUser.last_name,
          email: adminUser.email || username, // Fallback to username if email is not available
          avatar_url: adminUser.avatar_url,
          status: adminUser.status,
          role: adminUser.role
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success('Login successful!');
        return true;
      } else {
        toast.error('Invalid username or password');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('Logged out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
