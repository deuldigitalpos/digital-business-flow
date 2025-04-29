
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

interface SidebarNavLinkProps {
  href: string;
  icon: React.ElementType;
  title: string;
  permission?: string;
  onClick?: () => void;
  isSidebarOpen: boolean;
}

const SidebarNavLink: React.FC<SidebarNavLinkProps> = ({
  href,
  icon: Icon,
  title,
  permission,
  onClick,
  isSidebarOpen
}) => {
  const { hasPermission } = useBusinessAuth();
  
  // Check if user has permission to see this link
  if (permission && !hasPermission(permission)) {
    return null;
  }
  
  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground hover:bg-[#f99b23] hover:text-primary transition-colors",
          isActive && "bg-primary-foreground/10 font-medium"
        )
      }
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className={cn(!isSidebarOpen && "md:hidden")}>
        {title}
      </span>
    </NavLink>
  );
};

export default SidebarNavLink;
