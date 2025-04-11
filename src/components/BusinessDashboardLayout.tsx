
import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import BusinessDashboardHeader from '@/components/business-dashboard/BusinessDashboardHeader';
import BusinessSidebar from '@/components/business-dashboard/BusinessSidebar';
import { SidebarProvider } from '@/hooks/useSidebar';
import { Loader2 } from 'lucide-react';

const BusinessDashboardLayout = () => {
  const { isAuthenticated, isLoading } = useBusinessAuth();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we set up your dashboard.</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/business-login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-orange-50/30">
        <BusinessSidebar />
        <div className="flex flex-col flex-1 w-full">
          <BusinessDashboardHeader />
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BusinessDashboardLayout;
