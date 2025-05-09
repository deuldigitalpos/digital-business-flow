
import { SidebarNavSection } from './types';
import { overviewNavigation } from './overview-navigation';
import { managementNavigation } from './management-navigation';
import { reportsNavigation } from './reports-navigation';
import { configurationNavigation } from './configuration-navigation';

export const sidebarNavigation: SidebarNavSection[] = [
  overviewNavigation,
  managementNavigation,
  reportsNavigation,
  configurationNavigation
];
