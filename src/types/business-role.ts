
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
  [key: string]: boolean | undefined;
}
