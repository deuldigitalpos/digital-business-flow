
import {
  Settings,
  Tags,
  PanelRight,
  ShoppingCart,
  Clock
} from 'lucide-react';
import { SidebarNavSection } from './types';

export const configurationNavigation: SidebarNavSection = {
  title: 'Configuration',
  items: [
    {
      title: 'Setup',
      icon: Settings,
      children: [
        {
          title: 'Categories',
          href: '/business-dashboard/categories',
          icon: Tags,
          permission: 'categories'
        },
        {
          title: 'Units',
          href: '/business-dashboard/units',
          icon: PanelRight,
          permission: 'units'
        },
        {
          title: 'Brands',
          href: '/business-dashboard/brands',
          icon: ShoppingCart,
          permission: 'brands'
        },
        {
          title: 'Warranties',
          href: '/business-dashboard/warranties',
          icon: Clock,
          permission: 'warranties'
        },
      ],
    },
  ],
};
