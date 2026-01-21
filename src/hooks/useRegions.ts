import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Region } from '@/types/news'

export function useRegions() {
  return useQuery({
    queryKey: ['regions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .order('name')

      if (error) throw error
      return data as Region[]
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}
