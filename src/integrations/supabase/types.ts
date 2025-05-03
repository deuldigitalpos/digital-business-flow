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
      business_addons: {
        Row: {
          business_id: string
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          unit_id: string | null
          updated_at: string
        }
        Insert: {
          business_id: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          unit_id?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          unit_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_addons_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businessdetails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_addons_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "business_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_addons_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "business_units"
            referencedColumns: ["id"]
          },
        ]
      }
      business_brands: {
        Row: {
          business_id: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          updated_at?: string | null
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
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          unit_id: string | null
          updated_at: string
        }
        Insert: {
          business_id: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          unit_id?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          unit_id?: string | null
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
            foreignKeyName: "business_consumables_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "business_categories"
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
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          unit_id: string | null
          updated_at: string
        }
        Insert: {
          business_id: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          unit_id?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          unit_id?: string | null
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
            foreignKeyName: "business_ingredients_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "business_categories"
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
      business_inventory_quantities: {
        Row: {
          average_cost: number | null
          business_id: string
          id: string
          item_id: string
          item_type: string
          minimum_quantity: number | null
          quantity: number | null
          total_value: number | null
          updated_at: string
        }
        Insert: {
          average_cost?: number | null
          business_id: string
          id?: string
          item_id: string
          item_type: string
          minimum_quantity?: number | null
          quantity?: number | null
          total_value?: number | null
          updated_at?: string
        }
        Update: {
          average_cost?: number | null
          business_id?: string
          id?: string
          item_id?: string
          item_type?: string
          minimum_quantity?: number | null
          quantity?: number | null
          total_value?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_inventory_quantities_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businessdetails"
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
      business_product_addons: {
        Row: {
          addon_id: string
          cost: number | null
          created_at: string
          id: string
          product_id: string
          quantity: number
        }
        Insert: {
          addon_id: string
          cost?: number | null
          created_at?: string
          id?: string
          product_id: string
          quantity: number
        }
        Update: {
          addon_id?: string
          cost?: number | null
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "business_product_addons_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "business_addons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_product_addons_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "business_products"
            referencedColumns: ["id"]
          },
        ]
      }
      business_product_consumables: {
        Row: {
          consumable_id: string
          cost: number | null
          created_at: string
          id: string
          product_id: string
          quantity: number
        }
        Insert: {
          consumable_id: string
          cost?: number | null
          created_at?: string
          id?: string
          product_id: string
          quantity: number
        }
        Update: {
          consumable_id?: string
          cost?: number | null
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "business_product_consumables_consumable_id_fkey"
            columns: ["consumable_id"]
            isOneToOne: false
            referencedRelation: "business_consumables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_product_consumables_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "business_products"
            referencedColumns: ["id"]
          },
        ]
      }
      business_product_recipes: {
        Row: {
          cost: number | null
          created_at: string
          id: string
          ingredient_id: string
          product_id: string
          quantity: number
        }
        Insert: {
          cost?: number | null
          created_at?: string
          id?: string
          ingredient_id: string
          product_id: string
          quantity: number
        }
        Update: {
          cost?: number | null
          created_at?: string
          id?: string
          ingredient_id?: string
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "business_product_recipes_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "business_ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_product_recipes_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "business_products"
            referencedColumns: ["id"]
          },
        ]
      }
      business_product_sizes: {
        Row: {
          additional_price: number | null
          created_at: string
          id: string
          name: string
          product_id: string
          updated_at: string
        }
        Insert: {
          additional_price?: number | null
          created_at?: string
          id?: string
          name: string
          product_id: string
          updated_at?: string
        }
        Update: {
          additional_price?: number | null
          created_at?: string
          id?: string
          name?: string
          product_id?: string
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
          auto_generate_sku: boolean | null
          brand_id: string | null
          business_id: string
          category_id: string | null
          cost_price: number | null
          created_at: string
          description: string | null
          has_addons: boolean | null
          has_consumables: boolean | null
          has_ingredients: boolean | null
          has_sizes: boolean | null
          id: string
          image_url: string | null
          name: string
          product_id: string | null
          selling_price: number | null
          sku: string | null
          total_sales: number | null
          unit_id: string | null
          updated_at: string
          warranty_id: string | null
        }
        Insert: {
          auto_generate_sku?: boolean | null
          brand_id?: string | null
          business_id: string
          category_id?: string | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          has_addons?: boolean | null
          has_consumables?: boolean | null
          has_ingredients?: boolean | null
          has_sizes?: boolean | null
          id?: string
          image_url?: string | null
          name: string
          product_id?: string | null
          selling_price?: number | null
          sku?: string | null
          total_sales?: number | null
          unit_id?: string | null
          updated_at?: string
          warranty_id?: string | null
        }
        Update: {
          auto_generate_sku?: boolean | null
          brand_id?: string | null
          business_id?: string
          category_id?: string | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          has_addons?: boolean | null
          has_consumables?: boolean | null
          has_ingredients?: boolean | null
          has_sizes?: boolean | null
          id?: string
          image_url?: string | null
          name?: string
          product_id?: string | null
          selling_price?: number | null
          sku?: string | null
          total_sales?: number | null
          unit_id?: string | null
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
            foreignKeyName: "business_products_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "business_units"
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
          brand_id: string | null
          business_id: string
          cost_per_unit: number | null
          created_at: string
          created_by: string | null
          discount: number | null
          due_date: string | null
          expiration_date: string | null
          id: string
          item_id: string
          notes: string | null
          paid_amount: number | null
          payment_status: string
          quantity: number
          reference_id: string | null
          status: string
          supplier_id: string | null
          total_cost: number | null
          transaction_date: string
          transaction_type: string
          unpaid_amount: number | null
          updated_at: string
          warranty_id: string | null
        }
        Insert: {
          brand_id?: string | null
          business_id: string
          cost_per_unit?: number | null
          created_at?: string
          created_by?: string | null
          discount?: number | null
          due_date?: string | null
          expiration_date?: string | null
          id?: string
          item_id: string
          notes?: string | null
          paid_amount?: number | null
          payment_status: string
          quantity: number
          reference_id?: string | null
          status: string
          supplier_id?: string | null
          total_cost?: number | null
          transaction_date?: string
          transaction_type: string
          unpaid_amount?: number | null
          updated_at?: string
          warranty_id?: string | null
        }
        Update: {
          brand_id?: string | null
          business_id?: string
          cost_per_unit?: number | null
          created_at?: string
          created_by?: string | null
          discount?: number | null
          due_date?: string | null
          expiration_date?: string | null
          id?: string
          item_id?: string
          notes?: string | null
          paid_amount?: number | null
          payment_status?: string
          quantity?: number
          reference_id?: string | null
          status?: string
          supplier_id?: string | null
          total_cost?: number | null
          transaction_date?: string
          transaction_type?: string
          unpaid_amount?: number | null
          updated_at?: string
          warranty_id?: string | null
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
            foreignKeyName: "business_stock_transactions_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "business_suppliers"
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
          created_at: string | null
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          short_name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          short_name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          short_name?: string
          type?: string
          updated_at?: string | null
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
          created_at: string | null
          description: string | null
          duration: number
          duration_unit: string
          expiration_date: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          description?: string | null
          duration: number
          duration_unit: string
          expiration_date?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          description?: string | null
          duration?: number
          duration_unit?: string
          expiration_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
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
          created_at: string | null
          expires_at: string
          id: string
          product_id: string
          warranty_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          product_id: string
          warranty_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          product_id?: string
          warranty_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_warranty_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "business_products"
            referencedColumns: ["id"]
          },
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
      delete_product_consumables: {
        Args: { product_id_param: string }
        Returns: undefined
      }
      delete_product_recipes: {
        Args: { product_id_param: string }
        Returns: undefined
      }
      disable_rls: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      enable_rls: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
      insert_product_consumables: {
        Args: { items: Json }
        Returns: undefined
      }
      insert_product_recipes: {
        Args: { items: Json }
        Returns: undefined
      }
      set_business_user_id: {
        Args: { business_user_id: string }
        Returns: undefined
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
