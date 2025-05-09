
import {
  TrendingUp,
  FileBarChart,
  ListOrdered,
  FileText
} from 'lucide-react';
import { SidebarNavSection } from './types';

export const reportsNavigation: SidebarNavSection = {
  title: 'Reports',
  items: [
    {
      title: 'Profit and Loss Report',
      href: '/business-dashboard/reports/profit-loss',
      icon: TrendingUp,
      permission: 'reports'
    },
    {
      title: 'Stock Report',
      href: '/business-dashboard/reports/stock',
      icon: FileBarChart,
      permission: 'reports'
    },
    {
      title: 'Trending Products',
      href: '/business-dashboard/reports/trending-products',
      icon: TrendingUp,
      permission: 'reports'
    },
    {
      title: 'Register Report',
      href: '/business-dashboard/reports/register',
      icon: ListOrdered,
      permission: 'reports'
    },
    {
      title: 'Activity Log',
      href: '/business-dashboard/activity-log',
      icon: FileText,
      permission: 'activity_log'
    },
  ],
};
