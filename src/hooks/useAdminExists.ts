import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export function useAdminExists() {
  return useQuery({
    queryKey: ['admin_exists'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('admin_exists')
      if (error) throw error
      return data as boolean
    }
  })
}
