
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { BusinessUser } from '@/types/business-user';
import { Loader2 } from 'lucide-react';

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
        setIsLoading(false);
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
        setIsLoading(false);
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
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white px-4">
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

        <Card className="border border-orange-100 shadow-lg shadow-orange-100/20">
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
                  className="border-orange-200 focus-visible:ring-orange-500"
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
                  className="border-orange-200 focus-visible:ring-orange-500"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default BusinessLogin;
