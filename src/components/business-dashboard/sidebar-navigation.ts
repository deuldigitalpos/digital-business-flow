import { 
  LayoutDashboard, 
  Users, 
  Building, 
  MapPin, 
  FileText, 
  CreditCard, 
  ClipboardList, 
  Package, 
  Truck,
  BarChart, 
  Settings, 
  FileOutput, 
  Database, 
  UserPlus, 
  ShoppingCart,
  DollarSign,
  Landmark,
  Tags,
  Box,
  Boxes,
  Wrench,
  Tag,
  FileCheck
} from "lucide-react";

export interface SidebarNavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  permission?: string;
  children?: SidebarNavItem[];
}

export interface SidebarNavGroup {
  title: string;
  items: SidebarNavItem[];
}

export const sidebarNavigation: SidebarNavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/business-dashboard",
        icon: LayoutDashboard,
        permission: "dashboard",
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        title: "Users",
        href: "/business-dashboard/users",
        icon: Users,
        permission: "users",
      },
      {
        title: "Roles",
        href: "/business-dashboard/roles",
        icon: UserPlus,
        permission: "roles",
      },
    ],
  },
  {
    title: "Business Setup",
    items: [
      {
        title: "Locations",
        href: "/business-dashboard/locations",
        icon: MapPin,
        permission: "locations",
      },
      {
        title: "Taxes",
        href: "/business-dashboard/taxes",
        icon: DollarSign,
        permission: "taxes",
      },
    ],
  },
  {
    title: "Contacts",
    items: [
      {
        title: "Customers",
        href: "/business-dashboard/customers",
        icon: Users,
        permission: "customers",
      },
      {
        title: "Leads",
        href: "/business-dashboard/leads",
        icon: UserPlus,
        permission: "customers",
      },
      {
        title: "Suppliers",
        href: "/business-dashboard/suppliers",
        icon: Truck,
        permission: "suppliers",
      },
    ],
  },
  {
    title: "Inventory",
    items: [
      {
        title: "Products",
        href: "/business-dashboard/products",
        icon: Package,
        permission: "products",
      },
      {
        title: "Categories",
        href: "/business-dashboard/categories",
        icon: Tags,
        permission: "categories",
      },
      {
        title: "Units",
        href: "/business-dashboard/units",
        icon: Box,
        permission: "products",
      },
      {
        title: "Brands",
        href: "/business-dashboard/brands",
        icon: Tag,
        permission: "products",
      },
      {
        title: "Warranties",
        href: "/business-dashboard/warranties",
        icon: FileCheck,
        permission: "products",
      },
      {
        title: "Consumables",
        href: "/business-dashboard/consumables",
        icon: Boxes,
        permission: "products",
      },
      {
        title: "Equipment",
        href: "/business-dashboard/equipment",
        icon: Wrench,
        permission: "products",
      },
      {
        title: "Service",
        href: "/business-dashboard/service",
        icon: ClipboardList,
        permission: "products",
      },
      {
        title: "Stock Management",
        href: "/business-dashboard/stock",
        icon: Database,
        permission: "stock",
      },
      {
        title: "Purchases",
        href: "/business-dashboard/purchases",
        icon: ShoppingCart,
        permission: "purchases",
      },
    ],
  },
  {
    title: "Sales & Finances",
    items: [
      {
        title: "POS",
        href: "/business-dashboard/pos",
        icon: CreditCard,
        permission: "pos",
      },
      {
        title: "Sales",
        href: "/business-dashboard/sales",
        icon: ShoppingCart,
        permission: "sales",
      },
      {
        title: "Invoices",
        href: "/business-dashboard/invoices",
        icon: FileText,
        permission: "sales",
      },
      {
        title: "Expenses",
        href: "/business-dashboard/expenses",
        icon: FileOutput,
        permission: "expenses",
      },
      {
        title: "Banking",
        href: "/business-dashboard/banking",
        icon: Landmark,
        permission: "financials",
      },
    ],
  },
  {
    title: "Reports & Settings",
    items: [
      {
        title: "Reports",
        href: "/business-dashboard/reports",
        icon: BarChart,
        permission: "reports",
      },
      {
        title: "Settings",
        href: "/business-dashboard/settings",
        icon: Settings,
        permission: "settings",
      },
    ],
  },
];
