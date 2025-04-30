export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      adminuser: {
        Row: {
          created_at: string
          first_name: string
          id: string
          last_name: string
          password: string
          role: string | null
          status: string | null
          username: string
        }
        Insert: {
          created_at?: string
          first_name: string
          id?: string
          last_name: string
          password: string
          role?: string | null
          status?: string | null
          username: string
        }
        Update: {
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          password?: string
          role?: string | null
          status?: string | null
          username?: string
        }
        Relationships: []
      }
      business_activity_logs: {
        Row: {
          action_type: string
          business_id: string
          created_at: string
          id: string
          item_id: string
          item_name: string
          new_value: Json | null
          page: string
          previous_value: Json | null
          reason: string | null
          updated_by: string
        }
        Insert: {
          action_type: string
          business_id: string
          created_at?: string
          id?: string
          item_id: string
          item_name: string
          new_value?: Json | null
          page: string
          previous_value?: Json | null
          reason?: string | null
          updated_by: string
        }
        Update: {
          action_type?: string
          business_id?: string
          created_at?: string
          id?: string
          item_id?: string
          item_name?: string
          new_value?: Json | null
          page?: string
          previous_value?: Json | null
          reason?: string | null
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_activity_logs_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businessdetails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_activity_logs_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "business_users"
            referencedColumns: ["id"]
          },
        ]
      }
      business_brands: {
        Row: {
          business_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_brands_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businessdetails"
            referencedColumns: ["id"]
          },
        ]
      }
      business_categories: {
        Row: {
          business_id: string
          created_at: string
          description: string | null
          id: string
          monthly_sales: number | null
          name: string
          total_sales: number | null
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          description?: string | null
          id?: string
          monthly_sales?: number | null
          name: string
          total_sales?: number | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          description?: string | null
          id?: string
          monthly_sales?: number | null
          name?: string
          total_sales?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_categories_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businessdetails"
            referencedColumns: ["id"]
          },
        ]
      }
      business_consumables: {
        Row: {
          business_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          quantity_available: number
          status: string | null
          total_cost: number | null
          unit_id: string | null
          unit_price: number
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          quantity_available?: number
          status?: string | null
          total_cost?: number | null
          unit_id?: string | null
          unit_price?: number
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          quantity_available?: number
          status?: string | null
          total_cost?: number | null
          unit_id?: string | null
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_consumables_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businessdetails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_consumables_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "business_units"
            referencedColumns: ["id"]
          },
        ]
      }
      business_customers: {
        Row: {
          account_status: string
          address: string | null
          business_id: string
          business_name: string | null
          created_at: string
          credit_limit: number | null
          customer_id: string | null
          email: string | null
          first_name: string
          id: string
          is_lead: boolean | null
          last_name: string
          lead_source_id: string | null
          mobile_number: string | null
          tin_number: string | null
          total_amount_invoices_due: number | null
          total_invoices: number | null
          total_invoices_due: number | null
          total_sale: number | null
          total_sell_return_due: number | null
          updated_at: string
        }
        Insert: {
          account_status?: string
          address?: string | null
          business_id: string
          business_name?: string | null
          created_at?: string
          credit_limit?: number | null
          customer_id?: string | null
          email?: string | null
          first_name: string
          id?: string
          is_lead?: boolean | null
          last_name: string
          lead_source_id?: string | null
          mobile_number?: string | null
          tin_number?: string | null
          total_amount_invoices_due?: number | null
          total_invoices?: number | null
          total_invoices_due?: number | null
          total_sale?: number | null
          total_sell_return_due?: number | null
          updated_at?: string
        }
        Update: {
          account_status?: string
          address?: string | null
          business_id?: string
          business_name?: string | null
          created_at?: string
          credit_limit?: number | null
          customer_id?: string | null
          email?: string | null
          first_name?: string
          id?: string
          is_lead?: boolean | null
          last_name?: string
          lead_source_id?: string | null
          mobile_number?: string | null
          tin_number?: string | null
          total_amount_invoices_due?: number | null
          total_invoices?: number | null
          total_invoices_due?: number | null
          total_sale?: number | null
          total_sell_return_due?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_customers_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businessdetails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_customers_lead_source_id_fkey"
            columns: ["lead_source_id"]
            isOneToOne: false
            referencedRelation: "business_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      business_ingredients: {
        Row: {
          business_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          quantity_available: number
          status: string | null
          total_cost: number | null
          unit_id: string | null
          unit_price: number
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          quantity_available?: number
          status?: string | null
          total_cost?: number | null
          unit_id?: string | null
          unit_price?: number
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          quantity_available?: number
          status?: string | null
          total_cost?: number | null
          unit_id?: string | null
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_ingredients_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businessdetails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_ingredients_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "business_units"
            referencedColumns: ["id"]
          },
        ]
      }
      business_leads: {
        Row: {
          business_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_leads_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businessdetails"
            referencedColumns: ["id"]
          },
        ]
      }
      business_locations: {
        Row: {
          address: string
          business_id: string
          created_at: string
          id: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          address: string
          business_id: string
          created_at?: string
          id?: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string
          business_id?: string
          created_at?: string
          id?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_locations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businessdetails"
            referencedColumns: ["id"]
          },
        ]
      }
      business_product_sizes: {
        Row: {
          created_at: string
          id: string
          price: number
          product_id: string | null
          size_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          price: number
          product_id?: string | null
          size_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          price?: number
          product_id?: string | null
          size_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_product_sizes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "business_products"
            referencedColumns: ["id"]
          },
        ]
      }
      business_products: {
        Row: {
          alert_quantity: number | null
          brand_id: string | null
          business_id: string
          category_id: string | null
          consumable_id: string | null
          created_at: string
          description: string | null
          expiration_date: string | null
          id: string
          image_url: string | null
          ingredient_id: string | null
          is_consumable: boolean | null
          is_raw_ingredient: boolean | null
          location_id: string | null
          name: string
          product_id: string | null
          quantity_available: number | null
          quantity_sold: number | null
          sku: string | null
          status: string | null
          updated_at: string
          warranty_id: string | null
        }
        Insert: {
          alert_quantity?: number | null
          brand_id?: string | null
          business_id: string
          category_id?: string | null
          consumable_id?: string | null
          created_at?: string
          description?: string | null
          expiration_date?: string | null
          id?: string
          image_url?: string | null
          ingredient_id?: string | null
          is_consumable?: boolean | null
          is_raw_ingredient?: boolean | null
          location_id?: string | null
          name: string
          product_id?: string | null
          quantity_available?: number | null
          quantity_sold?: number | null
          sku?: string | null
          status?: string | null
          updated_at?: string
          warranty_id?: string | null
        }
        Update: {
          alert_quantity?: number | null
          brand_id?: string | null
          business_id?: string
          category_id?: string | null
          consumable_id?: string | null
          created_at?: string
          description?: string | null
          expiration_date?: string | null
          id?: string
          image_url?: string | null
          ingredient_id?: string | null
          is_consumable?: boolean | null
          is_raw_ingredient?: boolean | null
          location_id?: string | null
          name?: string
          product_id?: string | null
          quantity_available?: number | null
          quantity_sold?: number | null
          sku?: string | null
          status?: string | null
          updated_at?: string
          warranty_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "business_brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_products_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businessdetails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "business_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_products_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "business_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_products_warranty_id_fkey"
            columns: ["warranty_id"]
            isOneToOne: false
            referencedRelation: "business_warranties"
            referencedColumns: ["id"]
          },
        ]
      }
      business_roles: {
        Row: {
          business_id: string
          created_at: string
          id: string
          is_default: boolean
          name: string
          permissions: Json
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          is_default?: boolean
          name: string
          permissions?: Json
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          permissions?: Json
        }
        Relationships: [
          {
            foreignKeyName: "business_roles_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businessdetails"
            referencedColumns: ["id"]
          },
        ]
      }
      business_stock_transactions: {
        Row: {
          adjustment_reason: string | null
          business_id: string
          created_at: string
          id: string
          item_id: string
          item_type: string
          quantity: number
          reason: string | null
          transaction_type: string
          updated_by: string
        }
        Insert: {
          adjustment_reason?: string | null
          business_id: string
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          quantity: number
          reason?: string | null
          transaction_type: string
          updated_by: string
        }
        Update: {
          adjustment_reason?: string | null
          business_id?: string
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          quantity?: number
          reason?: string | null
          transaction_type?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_stock_transactions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businessdetails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_stock_transactions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "business_users"
            referencedColumns: ["id"]
          },
        ]
      }
      business_suppliers: {
        Row: {
          account_status: string
          address: string | null
          business_id: string
          business_name: string | null
          created_at: string
          credit_limit: number | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          mobile_number: string | null
          supplier_id: string | null
          tin_number: string | null
          total_amount_invoices_due: number | null
          total_invoices: number | null
          total_invoices_due: number | null
          total_purchase: number | null
          total_purchase_return_due: number | null
          updated_at: string
        }
        Insert: {
          account_status?: string
          address?: string | null
          business_id: string
          business_name?: string | null
          created_at?: string
          credit_limit?: number | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          mobile_number?: string | null
          supplier_id?: string | null
          tin_number?: string | null
          total_amount_invoices_due?: number | null
          total_invoices?: number | null
          total_invoices_due?: number | null
          total_purchase?: number | null
          total_purchase_return_due?: number | null
          updated_at?: string
        }
        Update: {
          account_status?: string
          address?: string | null
          business_id?: string
          business_name?: string | null
          created_at?: string
          credit_limit?: number | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          mobile_number?: string | null
          supplier_id?: string | null
          tin_number?: string | null
          total_amount_invoices_due?: number | null
          total_invoices?: number | null
          total_invoices_due?: number | null
          total_purchase?: number | null
          total_purchase_return_due?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_suppliers_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businessdetails"
            referencedColumns: ["id"]
          },
        ]
      }
      business_units: {
        Row: {
          business_id: string
          created_at: string
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          short_name: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          short_name: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          short_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_units_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businessdetails"
            referencedColumns: ["id"]
          },
        ]
      }
      business_users: {
        Row: {
          bank_account_name: string | null
          bank_account_number: string | null
          bank_name: string | null
          business_id: string
          contact_number: string | null
          created_at: string
          daily_rate: number | null
          date_of_birth: string | null
          email: string
          first_name: string
          gender: string | null
          id: string
          last_name: string
          marital_status: string | null
          password: string
          primary_work_location: string | null
          role: string
          role_id: string | null
          user_id: string
          username: string
        }
        Insert: {
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          business_id: string
          contact_number?: string | null
          created_at?: string
          daily_rate?: number | null
          date_of_birth?: string | null
          email: string
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          marital_status?: string | null
          password: string
          primary_work_location?: string | null
          role?: string
          role_id?: string | null
          user_id: string
          username: string
        }
        Update: {
          bank_account_name?: string | null
          bank_account_number?: string | null
          bank_name?: string | null
          business_id?: string
          contact_number?: string | null
          created_at?: string
          daily_rate?: number | null
          date_of_birth?: string | null
          email?: string
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          marital_status?: string | null
          password?: string
          primary_work_location?: string | null
          role?: string
          role_id?: string | null
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_users_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businessdetails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_users_primary_work_location_fkey"
            columns: ["primary_work_location"]
            isOneToOne: false
            referencedRelation: "business_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "business_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_warranties: {
        Row: {
          business_id: string
          created_at: string
          description: string | null
          duration: number
          duration_unit: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          description?: string | null
          duration: number
          duration_unit: string
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          description?: string | null
          duration?: number
          duration_unit?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_warranties_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businessdetails"
            referencedColumns: ["id"]
          },
        ]
      }
      business_warranty_products: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          product_id: string
          warranty_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          product_id: string
          warranty_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          product_id?: string
          warranty_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_warranty_products_warranty_id_fkey"
            columns: ["warranty_id"]
            isOneToOne: false
            referencedRelation: "business_warranties"
            referencedColumns: ["id"]
          },
        ]
      }
      businessdetails: {
        Row: {
          business_name: string
          contact_number: string | null
          country: string
          created_at: string
          currency: string
          custom_data: Json | null
          id: string
          logo_url: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          business_name: string
          contact_number?: string | null
          country: string
          created_at?: string
          currency: string
          custom_data?: Json | null
          id?: string
          logo_url?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          business_name?: string
          contact_number?: string | null
          country?: string
          created_at?: string
          currency?: string
          custom_data?: Json | null
          id?: string
          logo_url?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      user_locations: {
        Row: {
          created_at: string
          id: string
          location_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "business_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_locations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "business_users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_business_user_with_locations: {
        Args: {
          business_id_input: string
          user_data: Json
          location_ids: string[]
        }
        Returns: Json
      }
      get_business_users: {
        Args: { business_id_param: string }
        Returns: {
          id: string
          business_id: string
          user_id: string
          first_name: string
          last_name: string
          email: string
          username: string
          role: string
          created_at: string
        }[]
      }
      get_user_business_associations: {
        Args: { user_id_param: string }
        Returns: {
          business_id: string
        }[]
      }
      get_user_locations: {
        Args: { user_id_param: string }
        Returns: {
          location_id: string
        }[]
      }
      update_business_user_with_locations: {
        Args: { user_id_input: string; user_data: Json; location_ids: string[] }
        Returns: Json
      }
      user_belongs_to_my_business: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      user_has_business_access: {
        Args: { business_id_param: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
