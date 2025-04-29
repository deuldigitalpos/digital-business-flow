
import { Database } from "@/integrations/supabase/types";

// Extend Database Functions to include our supplier-related functions
export interface ExtendedFunctions extends Database['public']['Functions'] {
  create_business_supplier: {
    Args: { supplier_data: any };
    Returns: any;
  };
  update_business_supplier: {
    Args: { supplier_id: string, supplier_data: any };
    Returns: any;
  };
  delete_business_supplier: {
    Args: { supplier_id: string, business_id: string };
    Returns: any;
  };
  get_business_suppliers: {
    Args: { business_id_param: string };
    Returns: any;
  };
  update_business_supplier_status: {
    Args: { supplier_id: string, business_id: string, status: string };
    Returns: any;
  };
}
