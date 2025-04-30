
import {
  LayoutDashboard,
  Users,
  Building2,
  DollarSign,
  UserRound,
  Activity,
  BadgePercent,
  Settings,
  Home,
  Package2,
  Tags,
  Clock,
  ShoppingCart,
  CalendarClock,
  PanelRight,
  Store,
  Boxes,
  Utensils,
  PackageOpen,
  BarChart2,
  History,
  Coffee,
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
    ],
  },
  {
    title: 'Inventory',
    items: [
      {
        title: 'Products',
        href: '/business-dashboard/products',
        icon: Package2,
        permission: 'products'
      },
      {
        title: 'Ingredients',
        href: '/business-dashboard/ingredients',
        icon: Utensils,
        permission: 'ingredients'
      },
      {
        title: 'Consumables',
        href: '/business-dashboard/consumables',
        icon: Coffee,
        permission: 'consumables'
      },
      {
        title: 'Stock',
        href: '/business-dashboard/stock',
        icon: Boxes,
        permission: 'stock'
      },
      {
        title: 'Activity Log',
        href: '/business-dashboard/activity-log',
        icon: History,
        permission: 'activity_log'
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
        ],
      },
    ],
  },
];
