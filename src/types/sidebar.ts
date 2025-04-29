
import { LucideIcon } from 'lucide-react';

export interface SidebarNavItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  permission?: string;
  children?: SidebarNavItem[];
}

export type SidebarNavGroup = {
  title: string;
  items: SidebarNavItem[];
};
