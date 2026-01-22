import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Article } from '@/types/news'

interface UseRelatedArticlesOptions {
  articleId: string
  category: string
  regions?: string[]
  limit?: number
}

export function useRelatedArticles({ 
  articleId, 
  category, 
  regions = [], 
  limit = 4 
}: UseRelatedArticlesOptions) {
  return useQuery({
    queryKey: ['related-articles', articleId, category, regions],
    queryFn: async () => {
      // First try to find articles with matching regions
      let query = supabase
        .from('articles')
        .select(`
          *,
          source:sources(id, name, url)
        `)
        .neq('id', articleId)
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(limit)

      // If there are detected regions, prioritize those
      if (regions.length > 0) {
        query = query.overlaps('detected_regions', regions)
      } else {
        // Otherwise filter by category
        query = query.eq('category', category)
      }

      const { data: regionMatches, error: regionError } = await query

      if (regionError) throw regionError

      // If we have enough matches, return them
      if (regionMatches && regionMatches.length >= limit) {
        return regionMatches as (Article & { source: { id: string; name: string; url: string } })[]
      }

      // Otherwise, fill with category matches
      const existingIds = regionMatches?.map(a => a.id) || []
      existingIds.push(articleId)

      const remainingLimit = limit - (regionMatches?.length || 0)
      
      if (remainingLimit > 0) {
        const { data: categoryMatches, error: categoryError } = await supabase
          .from('articles')
          .select(`
            *,
            source:sources(id, name, url)
          `)
          .eq('category', category)
          .not('id', 'in', `(${existingIds.join(',')})`)
          .order('published_at', { ascending: false, nullsFirst: false })
          .limit(remainingLimit)

        if (categoryError) throw categoryError

        return [
          ...(regionMatches || []),
          ...(categoryMatches || [])
        ] as (Article & { source: { id: string; name: string; url: string } })[]
      }

      return regionMatches as (Article & { source: { id: string; name: string; url: string } })[]
    },
    enabled: !!articleId,
    staleTime: 1000 * 60 * 5,
  })
}
