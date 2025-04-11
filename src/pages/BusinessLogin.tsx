
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { BusinessUser } from '@/types/business-user';

const BusinessLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in as a business user
  const storedUser = localStorage.getItem('businessUser');
  if (storedUser) {
    return <Navigate to="/business-dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!username || !password) {
        toast.error('Please enter both username and password');
        return;
      }

      // Query the business_users table to find the user
      const { data, error } = await supabase
        .from('business_users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error) {
        console.error('Login error:', error);
        toast.error('Invalid username or password');
        return;
      }

      if (data) {
        const businessUser = data as unknown as BusinessUser;
        console.log('Business user login successful:', businessUser);
        
        // Store the business user info in localStorage
        localStorage.setItem('businessUser', JSON.stringify(businessUser));
        toast.success('Login successful!');
        navigate('/business-dashboard');
      } else {
        toast.error('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/1df1545d-8aea-4a95-8a04-a342cff67de7.png" 
            alt="DeulDigital Logo" 
            className="mx-auto h-16 w-auto mb-4" 
          />
          <h2 className="text-3xl font-bold text-primary">DeulDigital POS</h2>
          <p className="text-gray-600 mt-1">Business User Login</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Business Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your business dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default BusinessLogin;
