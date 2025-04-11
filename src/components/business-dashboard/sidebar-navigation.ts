
import { 
  LayoutDashboard,
  Users, 
  UserCircle2, 
  MapPin, 
  UserCircle, 
  Truck, 
  Box, 
  PackageCheck, 
  Tag, 
  ScanLine, 
  ClipboardList,
  PackageOpen, 
  FileText,
  ShoppingCart, 
  List, 
  ReceiptText, 
  FileBarChart, 
  ArrowLeftRight, 
  Wallet, 
  PieChart, 
  BarChart3, 
  Receipt, 
  Calendar, 
  Clock, 
  Settings,
  Building
} from 'lucide-react';

export type SidebarNavItem = {
  title: string;
  icon: React.ElementType;
  href?: string;
  children?: SidebarNavItem[];
};

export const sidebarNavItems: SidebarNavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/business-dashboard",
  },
  {
    title: "User Management",
    icon: Users,
    children: [
      {
        title: "Users",
        icon: UserCircle2,
        href: "/business-dashboard/users",
      },
      {
        title: "Roles",
        icon: UserCircle2,
        href: "/business-dashboard/roles",
      },
      {
        title: "Locations",
        icon: Building,
        href: "/business-dashboard/locations",
      },
      {
        title: "Contacts",
        icon: UserCircle,
        href: "/business-dashboard/contacts",
      },
      {
        title: "Customers",
        icon: UserCircle,
        href: "/business-dashboard/customers",
      },
      {
        title: "Suppliers",
        icon: Truck,
        href: "/business-dashboard/suppliers",
      },
    ],
  },
  {
    title: "Products & Inventory",
    icon: Box,
    children: [
      {
        title: "Product",
        icon: Box,
        href: "/business-dashboard/products",
      },
      {
        title: "List of Products",
        icon: List,
        href: "/business-dashboard/product-list",
      },
      {
        title: "Categories",
        icon: PackageCheck,
        href: "/business-dashboard/categories",
      },
      {
        title: "Units",
        icon: Box,
        href: "/business-dashboard/units",
      },
      {
        title: "Brands",
        icon: Tag,
        href: "/business-dashboard/brands",
      },
      {
        title: "Print Label",
        icon: ScanLine,
        href: "/business-dashboard/print-label",
      },
      {
        title: "Update Stock",
        icon: ClipboardList,
        href: "/business-dashboard/update-stock",
      },
      {
        title: "Stock Report",
        icon: FileText,
        href: "/business-dashboard/stock-report",
      },
      {
        title: "Inventory",
        icon: PackageOpen,
        href: "/business-dashboard/inventory",
      },
      {
        title: "Recipe / Ingredient",
        icon: ClipboardList,
        href: "/business-dashboard/recipe-ingredient",
      },
    ],
  },
  {
    title: "Purchases",
    icon: ShoppingCart,
    children: [
      {
        title: "Purchase Order",
        icon: ClipboardList,
        href: "/business-dashboard/purchase-order",
      },
      {
        title: "Purchase Return",
        icon: ClipboardList,
        href: "/business-dashboard/purchase-return",
      },
      {
        title: "Purchase Report",
        icon: FileText,
        href: "/business-dashboard/purchase-report",
      },
    ],
  },
  {
    title: "Sales",
    icon: ShoppingCart,
    children: [
      {
        title: "POS",
        icon: ShoppingCart,
        href: "/business-dashboard/pos",
      },
      {
        title: "Sales Order",
        icon: ClipboardList,
        href: "/business-dashboard/sales-order",
      },
      {
        title: "List of Sales",
        icon: List,
        href: "/business-dashboard/sales-list",
      },
      {
        title: "List of Quotations",
        icon: List,
        href: "/business-dashboard/quotations",
      },
      {
        title: "List of Invoices",
        icon: ReceiptText,
        href: "/business-dashboard/invoices",
      },
      {
        title: "List of Drafts",
        icon: FileText,
        href: "/business-dashboard/drafts",
      },
      {
        title: "List of Sale Returns",
        icon: List,
        href: "/business-dashboard/sale-returns",
      },
    ],
  },
  {
    title: "Stock Management",
    icon: PackageOpen,
    children: [
      {
        title: "Stock Transfer",
        icon: ArrowLeftRight,
        href: "/business-dashboard/stock-transfer",
      },
      {
        title: "Stock Adjustment",
        icon: ClipboardList,
        href: "/business-dashboard/stock-adjustment",
      },
    ],
  },
  {
    title: "Expenses",
    icon: Wallet,
    children: [
      {
        title: "List of Expenses",
        icon: List,
        href: "/business-dashboard/expenses",
      },
      {
        title: "Expense Categories",
        icon: Tag,
        href: "/business-dashboard/expense-categories",
      },
    ],
  },
  {
    title: "Financials",
    icon: Wallet,
    children: [
      {
        title: "Payment Accounts",
        icon: Wallet,
        href: "/business-dashboard/payment-accounts",
      },
      {
        title: "List of Accounts",
        icon: List,
        href: "/business-dashboard/accounts",
      },
      {
        title: "Balance Sheets",
        icon: FileText,
        href: "/business-dashboard/balance-sheets",
      },
      {
        title: "Trial Balance",
        icon: FileBarChart,
        href: "/business-dashboard/trial-balance",
      },
      {
        title: "Cash Flow",
        icon: Wallet,
        href: "/business-dashboard/cash-flow",
      },
      {
        title: "Payment Account Report",
        icon: FileText,
        href: "/business-dashboard/payment-account-report",
      },
    ],
  },
  {
    title: "Reports",
    icon: FileBarChart,
    children: [
      {
        title: "Profit / Loss Report",
        icon: FileBarChart,
        href: "/business-dashboard/profit-loss-report",
      },
      {
        title: "Purchase & Sale Report",
        icon: FileBarChart,
        href: "/business-dashboard/purchase-sale-report",
      },
      {
        title: "Tax Report",
        icon: FileText,
        href: "/business-dashboard/tax-report",
      },
      {
        title: "Customers & Suppliers Reports",
        icon: FileText,
        href: "/business-dashboard/customer-supplier-reports",
      },
      {
        title: "Stock Report",
        icon: FileText,
        href: "/business-dashboard/stock-report",
      },
      {
        title: "Stock Expiry Report",
        icon: FileText,
        href: "/business-dashboard/stock-expiry-report",
      },
      {
        title: "Stock Adjustment Report",
        icon: FileText,
        href: "/business-dashboard/stock-adjustment-report",
      },
      {
        title: "Trending Products",
        icon: BarChart3,
        href: "/business-dashboard/trending-products",
      },
      {
        title: "Items Report",
        icon: FileText,
        href: "/business-dashboard/items-report",
      },
      {
        title: "Product Purchase Report",
        icon: FileText,
        href: "/business-dashboard/product-purchase-report",
      },
      {
        title: "Product Sales Report",
        icon: FileText,
        href: "/business-dashboard/product-sales-report",
      },
      {
        title: "Expense Report",
        icon: FileText,
        href: "/business-dashboard/expense-report",
      },
      {
        title: "Register Report",
        icon: FileText,
        href: "/business-dashboard/register-report",
      },
      {
        title: "Activity Log",
        icon: List,
        href: "/business-dashboard/activity-log",
      },
    ],
  },
  {
    title: "Bookings & Operations",
    icon: Calendar,
    children: [
      {
        title: "Bookings",
        icon: Calendar,
        href: "/business-dashboard/bookings",
      },
      {
        title: "Project Management",
        icon: ClipboardList,
        href: "/business-dashboard/project-management",
      },
      {
        title: "Orders",
        icon: ClipboardList,
        href: "/business-dashboard/orders",
      },
      {
        title: "Kitchen",
        icon: ClipboardList,
        href: "/business-dashboard/kitchen",
      },
      {
        title: "Table",
        icon: ClipboardList,
        href: "/business-dashboard/table",
      },
    ],
  },
  {
    title: "HR & Settings",
    icon: Settings,
    children: [
      {
        title: "HRM",
        icon: Users,
        href: "/business-dashboard/hrm",
      },
      {
        title: "Essentials",
        icon: ClipboardList,
        href: "/business-dashboard/essentials",
      },
      {
        title: "Settings",
        icon: Settings,
        href: "/business-dashboard/settings",
      },
    ],
  }
];
