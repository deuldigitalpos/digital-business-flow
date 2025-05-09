
import { LucideIcon } from 'lucide-react';

export interface SidebarNavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  permission?: string;
  children?: SidebarNavItem[];
}

export interface SidebarNavSection {
  title: string;
  items: SidebarNavItem[];
}
