import React from 'react';
import { Navigate } from 'react-router-dom';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

interface PermissionGuardProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * A component that checks if the user has the required permission
 * or is a default user (who has all permissions)
 * and either renders the children or redirects to the fallback
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  permission, 
  children,
  fallback
}) => {
  const { hasPermission, isAuthenticated, isLoading } = useBusinessAuth();

  // While loading, show nothing to prevent flash of content
  if (isLoading) {
    return null;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/business-login" replace />;
  }

  // If user has permission, show the children
  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  // If a fallback is provided, show it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Otherwise, redirect to dashboard
  return <Navigate to="/business-dashboard/permission-denied" replace />;
};

export default PermissionGuard;
