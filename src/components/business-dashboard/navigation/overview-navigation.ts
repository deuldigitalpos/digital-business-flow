
import { LayoutDashboard } from 'lucide-react';
import { SidebarNavSection } from './types';

export const overviewNavigation: SidebarNavSection = {
  title: 'Overview',
  items: [
    {
      title: 'Dashboard',
      href: '/business-dashboard',
      icon: LayoutDashboard,
      permission: 'dashboard'
    },
  ]
};
