import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Article, Category } from '@/types/news'

interface UseArticlesOptions {
  category?: Category
  region?: string
  search?: string
  limit?: number
}

export function useArticles(options: UseArticlesOptions = {}) {
  const { category = 'all', region, search, limit = 50 } = options

  return useQuery({
    queryKey: ['articles', category, region, search, limit],
    queryFn: async () => {
      let query = supabase
        .from('articles')
        .select(`
          *,
          source:sources(id, name, url)
        `)
        // Sort by breaking first, then by published date
        .order('is_breaking', { ascending: false })
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(limit)

      if (category !== 'all') {
        query = query.eq('category', category)
      }

      if (region) {
        query = query.contains('detected_regions', [region])
      }

      if (search && search.trim()) {
        const searchTerm = `%${search.trim()}%`
        query = query.or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
      }

      const { data, error } = await query

      if (error) throw error
      return data as (Article & { source: { id: string; name: string; url: string } })[]
    },
    staleTime: 1000 * 60 * 2, // 2 minutes - refresh more often
    refetchInterval: 1000 * 60 * 2, // Auto-refetch every 2 minutes
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
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Auto-refetch every 30 seconds for breaking news
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
        // Prioritize breaking news in hero section
        .order('is_breaking', { ascending: false })
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(3)

      if (error) throw error
      return data as (Article & { source: { id: string; name: string; url: string } })[]
    },
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 2, // Auto-refetch every 2 minutes
  })
}
