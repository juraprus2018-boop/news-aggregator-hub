export interface Article {
  id: string
  slug: string | null
  source_id: string
  title: string
  description: string | null
  content: string | null
  url: string
  image_url: string | null
  published_at: string | null
  category: string
  detected_regions: string[]
  is_breaking: boolean
  created_at: string
  source?: Source
}

export interface Source {
  id: string
  name: string
  url: string
  rss_url: string
  category: string
  is_active: boolean
  last_crawled_at: string | null
  created_at: string
  updated_at: string
}

export interface Region {
  id: string
  name: string
  keywords: string[]
  created_at: string
}

export interface CrawlLog {
  id: string
  source_id: string | null
  status: string
  articles_found: number
  articles_added: number
  error_message: string | null
  created_at: string
}

export type Category = 'all' | 'nederland' | 'internationaal' | 'tech'
