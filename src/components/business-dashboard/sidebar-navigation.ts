
import {
  LayoutDashboard,
  Users,
  Building2,
  DollarSign,
  UserRound,
  Activity,
  BadgePercent,
  Settings,
  Tags,
  Clock,
  Store,
  BarChart2,
  PanelRight,
  ShoppingCart,
  Package,
  Database,
  Box,
  Ingredient,
  Plus,
} from 'lucide-react';

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

export const sidebarNavigation: SidebarNavSection[] = [
  {
    title: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/business-dashboard',
        icon: LayoutDashboard,
        permission: 'dashboard'
      },
    ]
  },
  {
    title: 'Management',
    items: [
      {
        title: 'Team',
        icon: Users,
        permission: 'user_management',
        children: [
          {
            title: 'Staff',
            href: '/business-dashboard/users',
            icon: UserRound,
            permission: 'users'
          },
          {
            title: 'Roles',
            href: '/business-dashboard/roles',
            icon: BadgePercent,
            permission: 'roles'
          }
        ],
      },
      {
        title: 'Locations',
        href: '/business-dashboard/locations',
        icon: Building2,
        permission: 'locations'
      },
      {
        title: 'Expenses',
        href: '/business-dashboard/expenses',
        icon: DollarSign,
        permission: 'expenses'
      },
      {
        title: 'People',
        icon: Users,
        children: [
          {
            title: 'Customers',
            href: '/business-dashboard/customers',
            icon: UserRound,
            permission: 'customers'
          },
          {
            title: 'Leads',
            href: '/business-dashboard/leads',
            icon: Activity,
            permission: 'leads'
          },
          {
            title: 'Suppliers',
            href: '/business-dashboard/suppliers',
            icon: Store,
            permission: 'suppliers'
          },
        ],
      },
      {
        title: 'Inventory',
        icon: Database,
        permission: 'inventory',
        children: [
          {
            title: 'Products',
            href: '/business-dashboard/inventory/products',
            icon: Package,
            permission: 'products'
          },
          {
            title: 'Consumables',
            href: '/business-dashboard/inventory/consumables',
            icon: Box,
            permission: 'inventory'
          },
          {
            title: 'Raw Ingredients',
            href: '/business-dashboard/inventory/ingredients',
            icon: Ingredient,
            permission: 'inventory'
          },
          {
            title: 'Add-ons',
            href: '/business-dashboard/inventory/addons',
            icon: Plus,
            permission: 'inventory'
          },
          {
            title: 'Stock Management',
            href: '/business-dashboard/inventory/stock',
            icon: ShoppingCart,
            permission: 'stock'
          },
        ],
      },
    ],
  },
  {
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
          {
            title: 'Activity Log',
            href: '/business-dashboard/activity-log',
            icon: BarChart2,
            permission: 'activity_log'
          },
        ],
      },
    ],
  },
];
