import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import type { Tables } from '@/integrations/supabase/types'

type CrawlLog = Tables<'crawl_logs'> & {
  sources?: { name: string } | null
}

export function useCrawlLogs(limit = 50) {
  return useQuery({
    queryKey: ['crawl_logs', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crawl_logs')
        .select(`
          *,
          sources (name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      return data as CrawlLog[]
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  })
}

export function useCrawlStats() {
  return useQuery({
    queryKey: ['crawl_stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crawl_logs')
        .select('status, articles_found, articles_added, created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      
      if (error) throw error
      
      const stats = {
        totalCrawls: data.length,
        successfulCrawls: data.filter(l => l.status === 'success').length,
        failedCrawls: data.filter(l => l.status === 'error').length,
        totalArticlesFound: data.reduce((sum, l) => sum + (l.articles_found || 0), 0),
        totalArticlesAdded: data.reduce((sum, l) => sum + (l.articles_added || 0), 0)
      }
      
      return stats
    },
    refetchInterval: 30000
  })
}
