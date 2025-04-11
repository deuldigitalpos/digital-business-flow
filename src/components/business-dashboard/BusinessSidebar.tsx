import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSidebar } from '@/hooks/useSidebar';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
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
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronsUpDown,
  Building
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type SidebarNavItem = {
  title: string;
  icon: React.ElementType;
  href?: string;
  children?: SidebarNavItem[];
};

const BusinessSidebar = () => {
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const { businessUser, logout } = useBusinessAuth();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const navItems: SidebarNavItem[] = [
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

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}
      
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-primary text-primary-foreground shadow-lg transition-transform duration-300 md:sticky md:top-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 py-4 border-b border-primary-foreground/10">
          <div className={cn("flex items-center gap-2", !isSidebarOpen && "md:hidden")}>
            <img 
              src="/lovable-uploads/1df1545d-8aea-4a95-8a04-a342cff67de7.png" 
              alt="Logo"
              className="h-8 w-auto"
            />
            <span className="font-bold text-lg">DeulDigital</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="hidden md:flex text-primary-foreground hover:bg-primary-foreground/10"
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => (
              item.children ? (
                <Collapsible 
                  key={item.title}
                  open={openSections[item.title]}
                  onOpenChange={() => toggleSection(item.title)}
                  className="w-full"
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-between text-sm text-primary-foreground hover:bg-[#f99b23] hover:text-primary",
                        !isSidebarOpen && "md:justify-center md:p-2"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        {(isSidebarOpen || !navItems.some(i => i.children)) && (
                          <span className={cn(!isSidebarOpen && "md:hidden")}>
                            {item.title}
                          </span>
                        )}
                      </div>
                      {(isSidebarOpen || !navItems.some(i => i.children)) && (
                        <ChevronDown 
                          className={cn(
                            "h-4 w-4 shrink-0 transition-transform duration-200",
                            openSections[item.title] && "rotate-180",
                            !isSidebarOpen && "md:hidden"
                          )}
                        />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className={cn(!isSidebarOpen && "md:hidden")}>
                    <div className="ml-6 mt-1 flex flex-col gap-1 border-l-2 border-primary-foreground/10 pl-2">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.href}
                          to={child.href || "#"}
                          onClick={closeSidebar}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-primary-foreground hover:bg-[#f99b23] hover:text-primary transition-colors",
                              isActive && "bg-primary-foreground/10 font-medium"
                            )
                          }
                        >
                          <child.icon className="h-4 w-4 shrink-0" />
                          <span>{child.title}</span>
                        </NavLink>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <NavLink
                  key={item.title}
                  to={item.href || "#"}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-primary-foreground hover:bg-[#f99b23] hover:text-primary transition-colors",
                      isActive && "bg-primary-foreground/10 font-medium"
                    )
                  }
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className={cn(!isSidebarOpen && "md:hidden")}>
                    {item.title}
                  </span>
                </NavLink>
              )
            ))}
          </nav>
        </ScrollArea>

        <div className="mt-auto p-4 border-t border-primary-foreground/10">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-primary-foreground hover:bg-[#f99b23] hover:text-primary",
              !isSidebarOpen && "md:justify-center"
            )}
            onClick={logout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            <span className={cn(!isSidebarOpen && "md:hidden")}>Logout</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default BusinessSidebar;
