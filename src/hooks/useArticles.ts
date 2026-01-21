import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Article, Category } from '@/types/news'

interface UseArticlesOptions {
  category?: Category
  region?: string
  limit?: number
}

export function useArticles(options: UseArticlesOptions = {}) {
  const { category = 'all', region, limit = 50 } = options

  return useQuery({
    queryKey: ['articles', category, region, limit],
    queryFn: async () => {
      let query = supabase
        .from('articles')
        .select(`
          *,
          source:sources(id, name, url)
        `)
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(limit)

      if (category !== 'all') {
        query = query.eq('category', category)
      }

      if (region) {
        query = query.contains('detected_regions', [region])
      }

      const { data, error } = await query

      if (error) throw error
      return data as (Article & { source: { id: string; name: string; url: string } })[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useBreakingNews() {
  return useQuery({
    queryKey: ['breaking-news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          source:sources(id, name, url)
        `)
        .eq('is_breaking', true)
        .order('published_at', { ascending: false })
        .limit(5)

      if (error) throw error
      return data as (Article & { source: { id: string; name: string; url: string } })[]
    },
    staleTime: 1000 * 60, // 1 minute
  })
}

export function useHeroArticles() {
  return useQuery({
    queryKey: ['hero-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          source:sources(id, name, url)
        `)
        .not('image_url', 'is', null)
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(3)

      if (error) throw error
      return data as (Article & { source: { id: string; name: string; url: string } })[]
    },
    staleTime: 1000 * 60 * 5,
  })
}
