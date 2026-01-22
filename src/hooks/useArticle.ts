import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Article } from '@/types/news'

type ArticleWithSource = Article & { source: { id: string; name: string; url: string } }

export function useArticle(slug: string | undefined) {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: async () => {
      if (!slug) throw new Error('No article slug provided')
      
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          source:sources(id, name, url)
        `)
        .eq('slug', slug)
        .maybeSingle()

      if (error) throw error
      if (!data) throw new Error('Article not found')
      
      return data as unknown as ArticleWithSource
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
