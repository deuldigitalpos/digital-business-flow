
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SidebarNavLinkProps {
  href: string;
  icon: React.ElementType;
  title: string;
  onClick?: () => void;
  isSidebarOpen: boolean;
}

const SidebarNavLink: React.FC<SidebarNavLinkProps> = ({
  href,
  icon: Icon,
  title,
  onClick,
  isSidebarOpen
}) => {
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
