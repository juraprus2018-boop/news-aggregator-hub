import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Article } from '@/types/news'

export function useArticle(id: string | undefined) {
  return useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      if (!id) throw new Error('No article ID provided')
      
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          source:sources(id, name, url)
        `)
        .eq('id', id)
        .maybeSingle()

      if (error) throw error
      if (!data) throw new Error('Article not found')
      
      return data as Article & { source: { id: string; name: string; url: string } }
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
