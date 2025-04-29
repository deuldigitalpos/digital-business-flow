
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
  permission?: string;
  children?: SidebarNavItem[];
};

export const sidebarNavItems: SidebarNavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/business-dashboard",
    permission: "dashboard"
  },
  {
    title: "User Management",
    icon: Users,
    permission: "user_management",
    children: [
      {
        title: "Users",
        icon: UserCircle2,
        href: "/business-dashboard/users",
        permission: "users"
      },
      {
        title: "Roles",
        icon: UserCircle2,
        href: "/business-dashboard/roles",
        permission: "roles"
      },
      {
        title: "Locations",
        icon: Building,
        href: "/business-dashboard/locations",
        permission: "locations"
      },
      {
        title: "Contacts",
        icon: UserCircle,
        href: "/business-dashboard/contacts",
        permission: "contacts"
      },
      {
        title: "Customers",
        icon: UserCircle,
        href: "/business-dashboard/customers",
        permission: "customers"
      },
      {
        title: "Suppliers",
        icon: Truck,
        href: "/business-dashboard/suppliers",
        permission: "suppliers"
      },
    ],
  },
  {
    title: "Products & Inventory",
    icon: Box,
    permission: "products",
    children: [
      {
        title: "Product",
        icon: Box,
        href: "/business-dashboard/products",
        permission: "products"
      },
      {
        title: "List of Products",
        icon: List,
        href: "/business-dashboard/product-list",
        permission: "products"
      },
      {
        title: "Categories",
        icon: PackageCheck,
        href: "/business-dashboard/categories",
        permission: "products"
      },
      {
        title: "Units",
        icon: Box,
        href: "/business-dashboard/units",
        permission: "products"
      },
      {
        title: "Brands",
        icon: Tag,
        href: "/business-dashboard/brands",
        permission: "products"
      },
      {
        title: "Print Label",
        icon: ScanLine,
        href: "/business-dashboard/print-label",
        permission: "products"
      },
      {
        title: "Update Stock",
        icon: ClipboardList,
        href: "/business-dashboard/update-stock",
        permission: "stock"
      },
      {
        title: "Stock Report",
        icon: FileText,
        href: "/business-dashboard/stock-report",
        permission: "stock"
      },
      {
        title: "Inventory",
        icon: PackageOpen,
        href: "/business-dashboard/inventory",
        permission: "inventory"
      },
      {
        title: "Recipe / Ingredient",
        icon: ClipboardList,
        href: "/business-dashboard/recipe-ingredient",
        permission: "inventory"
      },
    ],
  },
  {
    title: "Purchases",
    icon: ShoppingCart,
    permission: "purchases",
    children: [
      {
        title: "Purchase Order",
        icon: ClipboardList,
        href: "/business-dashboard/purchase-order",
        permission: "purchases"
      },
      {
        title: "Purchase Return",
        icon: ClipboardList,
        href: "/business-dashboard/purchase-return",
        permission: "purchases"
      },
      {
        title: "Purchase Report",
        icon: FileText,
        href: "/business-dashboard/purchase-report",
        permission: "purchases"
      },
    ],
  },
  {
    title: "Sales",
    icon: ShoppingCart,
    permission: "sales",
    children: [
      {
        title: "POS",
        icon: ShoppingCart,
        href: "/business-dashboard/pos",
        permission: "pos"
      },
      {
        title: "Sales Order",
        icon: ClipboardList,
        href: "/business-dashboard/sales-order",
        permission: "sales"
      },
      {
        title: "List of Sales",
        icon: List,
        href: "/business-dashboard/sales-list",
        permission: "sales"
      },
      {
        title: "List of Quotations",
        icon: List,
        href: "/business-dashboard/quotations",
        permission: "sales"
      },
      {
        title: "List of Invoices",
        icon: ReceiptText,
        href: "/business-dashboard/invoices",
        permission: "sales"
      },
      {
        title: "List of Drafts",
        icon: FileText,
        href: "/business-dashboard/drafts",
        permission: "sales"
      },
      {
        title: "List of Sale Returns",
        icon: List,
        href: "/business-dashboard/sale-returns",
        permission: "sales"
      },
    ],
  },
  {
    title: "Stock Management",
    icon: PackageOpen,
    permission: "stock",
    children: [
      {
        title: "Stock Transfer",
        icon: ArrowLeftRight,
        href: "/business-dashboard/stock-transfer",
        permission: "stock"
      },
      {
        title: "Stock Adjustment",
        icon: ClipboardList,
        href: "/business-dashboard/stock-adjustment",
        permission: "stock"
      },
    ],
  },
  {
    title: "Expenses",
    icon: Wallet,
    permission: "expenses",
    children: [
      {
        title: "List of Expenses",
        icon: List,
        href: "/business-dashboard/expenses",
        permission: "expenses"
      },
      {
        title: "Expense Categories",
        icon: Tag,
        href: "/business-dashboard/expense-categories",
        permission: "expenses"
      },
    ],
  },
  {
    title: "Financials",
    icon: Wallet,
    permission: "financials",
    children: [
      {
        title: "Payment Accounts",
        icon: Wallet,
        href: "/business-dashboard/payment-accounts",
        permission: "financials"
      },
      {
        title: "List of Accounts",
        icon: List,
        href: "/business-dashboard/accounts",
        permission: "financials"
      },
      {
        title: "Balance Sheets",
        icon: FileText,
        href: "/business-dashboard/balance-sheets",
        permission: "financials"
      },
      {
        title: "Trial Balance",
        icon: FileBarChart,
        href: "/business-dashboard/trial-balance",
        permission: "financials"
      },
      {
        title: "Cash Flow",
        icon: Wallet,
        href: "/business-dashboard/cash-flow",
        permission: "financials"
      },
      {
        title: "Payment Account Report",
        icon: FileText,
        href: "/business-dashboard/payment-account-report",
        permission: "financials"
      },
    ],
  },
  {
    title: "Reports",
    icon: FileBarChart,
    permission: "reports",
    children: [
      {
        title: "Profit / Loss Report",
        icon: FileBarChart,
        href: "/business-dashboard/profit-loss-report",
        permission: "reports"
      },
      {
        title: "Purchase & Sale Report",
        icon: FileBarChart,
        href: "/business-dashboard/purchase-sale-report",
        permission: "reports"
      },
      {
        title: "Tax Report",
        icon: FileText,
        href: "/business-dashboard/tax-report",
        permission: "reports"
      },
      {
        title: "Customers & Suppliers Reports",
        icon: FileText,
        href: "/business-dashboard/customer-supplier-reports",
        permission: "reports"
      },
      {
        title: "Stock Report",
        icon: FileText,
        href: "/business-dashboard/stock-report",
        permission: "reports"
      },
      {
        title: "Stock Expiry Report",
        icon: FileText,
        href: "/business-dashboard/stock-expiry-report",
        permission: "reports"
      },
      {
        title: "Stock Adjustment Report",
        icon: FileText,
        href: "/business-dashboard/stock-adjustment-report",
        permission: "reports"
      },
      {
        title: "Trending Products",
        icon: BarChart3,
        href: "/business-dashboard/trending-products",
        permission: "reports"
      },
      {
        title: "Items Report",
        icon: FileText,
        href: "/business-dashboard/items-report",
        permission: "reports"
      },
      {
        title: "Product Purchase Report",
        icon: FileText,
        href: "/business-dashboard/product-purchase-report",
        permission: "reports"
      },
      {
        title: "Product Sales Report",
        icon: FileText,
        href: "/business-dashboard/product-sales-report",
        permission: "reports"
      },
      {
        title: "Expense Report",
        icon: FileText,
        href: "/business-dashboard/expense-report",
        permission: "reports"
      },
      {
        title: "Register Report",
        icon: FileText,
        href: "/business-dashboard/register-report",
        permission: "reports"
      },
      {
        title: "Activity Log",
        icon: List,
        href: "/business-dashboard/activity-log",
        permission: "reports"
      },
    ],
  },
  {
    title: "Bookings & Operations",
    icon: Calendar,
    permission: "bookings",
    children: [
      {
        title: "Bookings",
        icon: Calendar,
        href: "/business-dashboard/bookings",
        permission: "bookings"
      },
      {
        title: "Project Management",
        icon: ClipboardList,
        href: "/business-dashboard/project-management",
        permission: "bookings"
      },
      {
        title: "Orders",
        icon: ClipboardList,
        href: "/business-dashboard/orders",
        permission: "bookings"
      },
      {
        title: "Kitchen",
        icon: ClipboardList,
        href: "/business-dashboard/kitchen",
        permission: "bookings"
      },
      {
        title: "Table",
        icon: ClipboardList,
        href: "/business-dashboard/table",
        permission: "bookings"
      },
    ],
  },
  {
    title: "HR & Settings",
    icon: Settings,
    permission: "settings",
    children: [
      {
        title: "HRM",
        icon: Users,
        href: "/business-dashboard/hrm",
        permission: "settings"
      },
      {
        title: "Essentials",
        icon: ClipboardList,
        href: "/business-dashboard/essentials",
        permission: "settings"
      },
      {
        title: "Settings",
        icon: Settings,
        href: "/business-dashboard/settings",
        permission: "settings"
      },
    ],
  }
];
