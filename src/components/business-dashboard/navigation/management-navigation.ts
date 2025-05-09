
import {
  Users,
  Building2,
  DollarSign,
  UserRound,
  Activity,
  BadgePercent,
  Store,
  Database,
  Box,
  Utensils,
  Plus,
  ShoppingCart,
  CreditCard,
  FileText,
  BookOpen,
  ChefHat,
  ShoppingBag,
  Calendar,
  PersonStanding,
  Briefcase,
  FileBarChart,
  Package
} from 'lucide-react';
import { SidebarNavSection } from './types';

export const managementNavigation: SidebarNavSection = {
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
          icon: Utensils,
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
    {
      title: 'Payment Accounts',
      icon: CreditCard,
      permission: 'accounts',
      children: [
        {
          title: 'List of Accounts',
          href: '/business-dashboard/accounts',
          icon: FileText,
          permission: 'accounts'
        },
        {
          title: 'Account Reports',
          href: '/business-dashboard/account-reports',
          icon: FileBarChart,
          permission: 'accounts'
        },
      ],
    },
    {
      title: 'Bookings',
      href: '/business-dashboard/bookings',
      icon: BookOpen,
      permission: 'bookings'
    },
    {
      title: 'Kitchen',
      href: '/business-dashboard/kitchen',
      icon: ChefHat,
      permission: 'kitchen'
    },
    {
      title: 'Orders',
      href: '/business-dashboard/orders',
      icon: ShoppingBag,
      permission: 'orders'
    },
    {
      title: 'Reservation',
      href: '/business-dashboard/reservation',
      icon: Calendar,
      permission: 'reservation'
    },
    {
      title: 'HRM',
      href: '/business-dashboard/hrm',
      icon: PersonStanding,
      permission: 'hrm'
    },
    {
      title: 'Essentials',
      href: '/business-dashboard/essentials',
      icon: Briefcase,
      permission: 'essentials'
    },
  ],
};
