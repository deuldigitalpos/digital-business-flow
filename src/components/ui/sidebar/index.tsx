
// This file re-exports all sidebar components for easier imports
import { SidebarProvider, useSidebar } from "./sidebar-context";
import { Sidebar, SidebarInset, SidebarRail, SidebarTrigger } from "./sidebar-main";
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInput,
  SidebarSeparator,
} from "./sidebar-sections";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "./sidebar-group";
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./sidebar-menu";

export {
  // Context
  SidebarProvider,
  useSidebar,
  
  // Main components
  Sidebar,
  SidebarInset,
  SidebarRail,
  SidebarTrigger,
  
  // Section components
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInput,
  SidebarSeparator,
  
  // Group components
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  
  // Menu components
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
};
