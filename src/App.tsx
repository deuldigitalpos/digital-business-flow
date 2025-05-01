
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import DashboardLayout from '@/components/DashboardLayout';
import Dashboard from '@/pages/Dashboard';
import UserManagement from '@/pages/UserManagement';
import Settings from '@/pages/Settings';
import PackageManagement from '@/pages/PackageManagement';
import DiscountManagement from '@/pages/DiscountManagement';
import ReferralManagement from '@/pages/ReferralManagement';
import BusinessManagement from '@/pages/BusinessManagement';
import NotFound from '@/pages/NotFound';
import PlaceholderPage from '@/pages/PlaceholderPage';
import BusinessLogin from '@/pages/BusinessLogin';
import BusinessDashboardLayout from '@/components/BusinessDashboardLayout';
import BusinessDashboard from '@/pages/BusinessDashboard';
import BusinessUsers from '@/pages/BusinessUsers';
import BusinessRoles from '@/pages/BusinessRoles';
import BusinessLocations from '@/pages/BusinessLocations';
import BusinessExpenses from '@/pages/BusinessExpenses';
import BusinessCustomers from '@/pages/BusinessCustomers';
import BusinessLeads from '@/pages/BusinessLeads';
import BusinessSuppliers from '@/pages/BusinessSuppliers';
import PermissionDenied from '@/pages/PermissionDenied';
import BusinessCategories from '@/pages/BusinessCategories';
import BusinessUnits from '@/pages/BusinessUnits';
import BusinessBrands from '@/pages/BusinessBrands';
import BusinessWarranties from '@/pages/BusinessWarranties';
import BusinessProducts from '@/pages/BusinessProducts';
import BusinessIngredients from '@/pages/BusinessIngredients';
import BusinessConsumables from '@/pages/BusinessConsumables';
import BusinessStock from '@/pages/BusinessStock';
import BusinessActivityLog from '@/pages/BusinessActivityLog';
import { BusinessAuthProvider } from '@/context/BusinessAuthContext';
import ProductDetailPage from "@/components/business/ProductDetailPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/business-login" element={<BusinessLogin />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="settings" element={<Settings />} />
              <Route path="packages" element={<PackageManagement />} />
              <Route path="discounts" element={<DiscountManagement />} />
              <Route path="referrals" element={<ReferralManagement />} />
              <Route path="businesses" element={<BusinessManagement />} />
              <Route path="business" element={<BusinessManagement />} />
              <Route path="*" element={<PlaceholderPage />} />
            </Route>

            {/* Business Dashboard Routes - BusinessAuthProvider wraps all business routes */}
            <Route 
              path="/business-dashboard" 
              element={
                <BusinessAuthProvider>
                  <BusinessDashboardLayout />
                </BusinessAuthProvider>
              }
            >
              <Route index element={<BusinessDashboard />} />
              <Route path="users" element={<BusinessUsers />} />
              <Route path="roles" element={<BusinessRoles />} />
              <Route path="locations" element={<BusinessLocations />} />
              <Route path="categories" element={<BusinessCategories />} />
              <Route path="expenses" element={<BusinessExpenses />} />
              <Route path="customers" element={<BusinessCustomers />} />
              <Route path="leads" element={<BusinessLeads />} />
              <Route path="suppliers" element={<BusinessSuppliers />} />
              <Route path="units" element={<BusinessUnits />} />
              <Route path="brands" element={<BusinessBrands />} />
              <Route path="warranties" element={<BusinessWarranties />} />
              <Route path="products" element={<BusinessProducts />} />
              <Route path="products/:productId" element={<ProductDetailPage />} />
              <Route path="consumables" element={<BusinessConsumables />} />
              <Route path="ingredients" element={<BusinessIngredients />} />
              <Route path="stocks" element={<BusinessStock />} />
              <Route path="activity-log" element={<BusinessActivityLog />} />
              <Route path="no-permission" element={<PermissionDenied />} />
              <Route path="*" element={<PlaceholderPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
