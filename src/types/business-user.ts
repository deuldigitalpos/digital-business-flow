
export interface BusinessUser {
  id: string;
  business_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role: string;
  role_id?: string; // Added role_id as optional property
  password?: string; // Keep the existing optional property
  created_at: string;
}
