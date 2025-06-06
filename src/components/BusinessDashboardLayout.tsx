
import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import BusinessDashboardHeader from '@/components/business-dashboard/BusinessDashboardHeader';
import BusinessSidebar from '@/components/business-dashboard/BusinessSidebar';
import { SidebarProvider } from '@/hooks/useSidebar';
import { Loader2 } from 'lucide-react';
import { setSupabaseBusinessAuth, clearSupabaseBusinessAuth } from '@/integrations/supabase/client';
import { isBusinessActive } from '@/utils/business';
import BusinessDeactivationOverlay from '@/components/business/BusinessDeactivationOverlay';

const BusinessDashboardLayout = () => {
  const { isAuthenticated, isLoading, businessUser, business } = useBusinessAuth();
  const location = useLocation();
  
  // Set up business user authentication for Supabase
  useEffect(() => {
    if (businessUser?.id) {
      console.log('Setting up business user authentication in Dashboard layout');
      setSupabaseBusinessAuth(businessUser.id);
      console.log('Business user ID set to:', businessUser.id);
    } else {
      console.log('No business user ID available to set auth');
    }
    
    return () => {
      clearSupabaseBusinessAuth();
    };
  }, [businessUser?.id]); // Dependency on businessUser.id to ensure it updates if ID changes
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Prevent infinite redirect loop by returning null during loading
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50/30">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we set up your dashboard.</p>
        </div>
      </div>
    );
  }
  
  // Only redirect when explicitly not authenticated (not during loading)
  if (isAuthenticated === false) {
    return <Navigate to="/business-login" replace />;
  }

  // Check if business is active
  const isActive = business ? isBusinessActive(business) : true;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-orange-50/30">
        <BusinessSidebar />
        <div className="flex flex-col flex-1 w-full max-h-screen overflow-hidden">
          <BusinessDashboardHeader />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
        
        {/* Show deactivation overlay if business is not active */}
        {business && !isActive && <BusinessDeactivationOverlay />}
      </div>
    </SidebarProvider>
  );
};

export default BusinessDashboardLayout;
