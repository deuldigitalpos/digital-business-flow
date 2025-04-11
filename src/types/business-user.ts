
export interface BusinessUser {
  id: string;
  business_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role: string;
  password?: string; // Added password as optional property
  created_at: string;
}
