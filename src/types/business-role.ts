
export interface BusinessRole {
  id: string;
  business_id: string;
  name: string;
  permissions: BusinessRolePermissions;
  is_default: boolean;
  created_at: string;
}

export interface BusinessRolePermissions {
  dashboard?: boolean;
  user_management?: boolean;
  users?: boolean;
  roles?: boolean;
  pos?: boolean;
  bookings?: boolean;
  products?: boolean;
  inventory?: boolean;
  purchases?: boolean;
  sales?: boolean;
  stock?: boolean;
  expenses?: boolean;
  financials?: boolean;
  reports?: boolean;
  settings?: boolean;
  locations?: boolean;
  customers?: boolean;
  suppliers?: boolean;
  leads?: boolean;
  activity_log?: boolean;
  categories?: boolean;
  units?: boolean;
  brands?: boolean;
  warranties?: boolean;
  [key: string]: boolean | undefined;
}
