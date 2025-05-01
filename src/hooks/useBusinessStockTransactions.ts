
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBusinessAuth } from '@/context/BusinessAuthContext';
import { toast } from 'sonner';

export interface StockTransaction {
  id: string;
  business_id: string;
  transaction_type: 'product' | 'consumable' | 'ingredient' | 'addon';
  item_id: string;
  reference_id: string | null;
  supplier_id: string | null;
  transaction_date: string;
  quantity: number;
  unit_id: string | null;
  cost_per_unit: number;
  total_cost: number;
  status: 'delivered' | 'ordered' | 'damaged' | 'returned';
  payment_status: 'paid' | 'unpaid' | 'partial' | 'refunded';
  discount: number;
  paid_amount: number;
  unpaid_amount: number;
  due_date: string | null;
  brand_id: string | null;
  warranty_id: string | null;
  expiration_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  supplier?: { 
    first_name: string;
    last_name: string;
  } | null;
  unit?: {
    name: string;
    short_name: string;
  } | null;
  brand?: {
    name: string;
  } | null;
}

export const useBusinessStockTransactions = (
  filters: {
    itemId?: string;
    transactionType?: string;
    status?: string;
    paymentStatus?: string;
    supplierId?: string;
    startDate?: Date;
    endDate?: Date;
  } = {}
) => {
  const { businessUser } = useBusinessAuth();

  const { data: transactions, isLoading, error, refetch } = useQuery({
    queryKey: ['business-stock-transactions', businessUser?.business_id, filters],
    queryFn: async () => {
      if (!businessUser?.business_id) return [];

      let query = supabase
        .from('business_stock_transactions')
        .select(`
          *,
          supplier:supplier_id(first_name, last_name),
          unit:unit_id(name, short_name),
          brand:brand_id(name)
        `)
        .eq('business_id', businessUser.business_id);

      // Apply filters
      if (filters.itemId) {
        query = query.eq('item_id', filters.itemId);
      }
      
      if (filters.transactionType) {
        query = query.eq('transaction_type', filters.transactionType);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.paymentStatus) {
        query = query.eq('payment_status', filters.paymentStatus);
      }
      
      if (filters.supplierId) {
        query = query.eq('supplier_id', filters.supplierId);
      }
      
      if (filters.startDate) {
        query = query.gte('transaction_date', filters.startDate.toISOString());
      }
      
      if (filters.endDate) {
        query = query.lte('transaction_date', filters.endDate.toISOString());
      }

      const { data, error } = await query.order('transaction_date', { ascending: false });

      if (error) {
        console.error('Error fetching stock transactions:', error);
        toast.error('Failed to load stock transactions');
        return [];
      }

      return data;
    },
    enabled: !!businessUser?.business_id,
  });

  return {
    transactions,
    isLoading,
    error,
    refetch,
  };
};

export default useBusinessStockTransactions;
