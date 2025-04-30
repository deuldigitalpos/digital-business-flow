
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BusinessActivityLog, ActivityLogFilters } from '@/types/business-activity';
import { useBusinessAuth } from '@/context/BusinessAuthContext';

export function useBusinessActivityLogs(filters: ActivityLogFilters = {}) {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['business-activity-logs', business?.id, filters],
    queryFn: async () => {
      if (!business?.id) {
        return [];
      }

      let query = supabase
        .from('business_activity_logs')
        .select(`
          *,
          business_users!updated_by(first_name, last_name)
        `)
        .eq('business_id', business.id)
        .order('created_at', { ascending: false });

      if (filters.page) {
        query = query.eq('page', filters.page);
      }

      if (filters.action_type) {
        query = query.eq('action_type', filters.action_type);
      }

      if (filters.item_name) {
        query = query.ilike('item_name', `%${filters.item_name}%`);
      }

      if (filters.updated_by) {
        query = query.eq('updated_by', filters.updated_by);
      }

      if (filters.start_date) {
        query = query.gte('created_at', filters.start_date);
      }

      if (filters.end_date) {
        query = query.lte('created_at', filters.end_date);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching activity logs:', error);
        throw error;
      }

      return data.map(log => ({
        ...log,
        user_name: log.business_users ? 
          `${log.business_users.first_name} ${log.business_users.last_name}` : 
          'Unknown User'
      })) as (BusinessActivityLog & { user_name: string })[];
    },
    enabled: !!business?.id,
  });
}

export function useRecentActivityLogs(limit: number = 10) {
  const { business } = useBusinessAuth();

  return useQuery({
    queryKey: ['recent-activity-logs', business?.id, limit],
    queryFn: async () => {
      if (!business?.id) {
        return [];
      }

      const { data, error } = await supabase
        .from('business_activity_logs')
        .select(`
          *,
          business_users!updated_by(first_name, last_name)
        `)
        .eq('business_id', business.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent activity logs:', error);
        throw error;
      }

      return data.map(log => ({
        ...log,
        user_name: log.business_users ? 
          `${log.business_users.first_name} ${log.business_users.last_name}` : 
          'Unknown User'
      })) as (BusinessActivityLog & { user_name: string })[];
    },
    enabled: !!business?.id,
  });
}
