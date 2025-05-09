
import { 
  Users, ShieldCheck, MapPin, DollarSign, 
  UserCog, Package, LayoutGrid, Box, PackagePlus, 
  ShoppingBag, PackageOpen, UserPlus, Briefcase,
  UserCheck, CreditCard, List, FolderTree
} from 'lucide-react';

export const managementNavigation = {
  title: 'Management',
  items: [
    {
      title: 'User Management',
      icon: UserCog,
      children: [
        {
          title: 'Users',
          href: '/business-dashboard/users',
          icon: Users,
          permission: 'users'
        },
        {
          title: 'Roles',
          href: '/business-dashboard/roles',
          icon: ShieldCheck,
          permission: 'roles'
        }
      ]
    },
    {
      title: 'Contacts',
      icon: Users,
      children: [
        {
          title: 'Customers',
          href: '/business-dashboard/customers',
          icon: UserPlus,
          permission: 'customers'
        },
        {
          title: 'Leads',
          href: '/business-dashboard/leads',
          icon: UserCheck,
          permission: 'customers'
        },
        {
          title: 'Suppliers',
          href: '/business-dashboard/suppliers',
          icon: Briefcase,
          permission: 'suppliers'
        }
      ]
    },
    {
      title: 'Inventory',
      icon: Package,
      children: [
        {
          title: 'Products',
          href: '/business-dashboard/inventory/products',
          icon: Package,
          permission: 'products'
        },
        {
          title: 'Ingredients',
          href: '/business-dashboard/inventory/ingredients',
          icon: PackagePlus,
          permission: 'products'
        },
        {
          title: 'Consumables',
          href: '/business-dashboard/inventory/consumables',
          icon: Box,
          permission: 'products'
        },
        {
          title: 'Addons',
          href: '/business-dashboard/inventory/addons',
          icon: PackageOpen,
          permission: 'products'
        },
        {
          title: 'Stock',
          href: '/business-dashboard/inventory/stock',
          icon: ShoppingBag,
          permission: 'stock'
        }
      ]
    },
    {
      title: 'Point of Sale',
      href: '/business-dashboard/pos',
      icon: LayoutGrid,
      permission: 'pos'
    },
    {
      title: 'Expenses',
      icon: DollarSign,
      permission: 'expenses',
      children: [
        {
          title: 'Dashboard',
          href: '/business-dashboard/expenses',
          icon: DollarSign,
          permission: 'expenses'
        },
        {
          title: 'Categories',
          href: '/business-dashboard/expenses/categories',
          icon: FolderTree,
          permission: 'expenses'
        },
        {
          title: 'Payment Methods',
          href: '/business-dashboard/expenses/payment-methods',
          icon: CreditCard,
          permission: 'expenses'
        }
      ]
    },
    {
      title: 'Locations',
      href: '/business-dashboard/locations',
      icon: MapPin,
      permission: 'locations'
    }
  ]
};
