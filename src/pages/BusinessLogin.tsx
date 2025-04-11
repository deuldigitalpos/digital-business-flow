
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const BusinessLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, isLoading } = useBusinessAuth();
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        navigate('/business-dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already authenticated and not in the process of loading, redirect to dashboard
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/business-dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/1df1545d-8aea-4a95-8a04-a342cff67de7.png" 
            alt="DeulDigital Logo" 
            className="mx-auto h-16 w-auto mb-4" 
          />
          <h2 className="text-3xl font-bold text-orange-600">DeulDigital POS</h2>
          <p className="text-gray-600 mt-1">Business User Login</p>
        </div>

        <Card className="border border-orange-100 shadow-lg shadow-orange-100/20">
          <CardHeader className="bg-orange-50/50">
            <CardTitle className="text-orange-800">Business Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your business dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
            <CardFooter className="bg-orange-50/30 flex flex-col">
              <Button 
                type="submit" 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                disabled={isSubmitting || isLoading}
              >
                {(isSubmitting || isLoading) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isSubmitting ? "Logging in..." : "Loading..."}
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
