import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RSSItem {
  title: string
  link: string
  description?: string
  pubDate?: string
  enclosure?: { url: string }
  'media:content'?: { url: string }
}

// Simple XML parser for RSS feeds
function parseRSS(xml: string): RSSItem[] {
  const items: RSSItem[] = []
  const itemMatches = xml.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || []
  
  for (const itemXml of itemMatches) {
    const getTagContent = (tag: string): string | undefined => {
      // Handle CDATA sections
      const cdataMatch = itemXml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i'))
      if (cdataMatch) return cdataMatch[1].trim()
      
      const match = itemXml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
      return match ? match[1].trim() : undefined
    }
    
    const getAttrValue = (tag: string, attr: string): string | undefined => {
      const match = itemXml.match(new RegExp(`<${tag}[^>]*${attr}=["']([^"']+)["']`, 'i'))
      return match ? match[1] : undefined
    }
    
    const title = getTagContent('title')
    const link = getTagContent('link') || getTagContent('guid')
    
    if (title && link) {
      items.push({
        title: title.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, ''),
        link: link.replace(/<!\[CDATA\[|\]\]>/g, ''),
        description: getTagContent('description')?.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').slice(0, 500),
        pubDate: getTagContent('pubDate'),
        enclosure: { url: getAttrValue('enclosure', 'url') || '' },
        'media:content': { url: getAttrValue('media:content', 'url') || getAttrValue('media:thumbnail', 'url') || '' }
      })
    }
  }
  
  return items
}

// Detect regions from text
function detectRegions(text: string, regions: { name: string; keywords: string[] }[]): string[] {
  const lowerText = text.toLowerCase()
  const detected: string[] = []
  
  for (const region of regions) {
    for (const keyword of region.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        detected.push(region.name)
        break
      }
    }
  }
  
  return detected
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get all active sources
    const { data: sources, error: sourcesError } = await supabase
      .from('sources')
      .select('*')
      .eq('is_active', true)
    
    if (sourcesError) throw sourcesError
    
    // Get all regions for detection
    const { data: regions, error: regionsError } = await supabase
      .from('regions')
      .select('name, keywords')
    
    if (regionsError) throw regionsError
    
    const results = []
    
    for (const source of sources || []) {
      let articlesFound = 0
      let articlesAdded = 0
      let errorMessage: string | null = null
      
      try {
        // Fetch RSS feed
        const response = await fetch(source.rss_url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; NewsAggregator/1.0)'
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const xml = await response.text()
        const items = parseRSS(xml)
        articlesFound = items.length
        
        // Process each article
        for (const item of items.slice(0, 20)) { // Limit to 20 per source
          const textForRegionDetection = `${item.title} ${item.description || ''}`
          const detectedRegions = detectRegions(textForRegionDetection, regions || [])
          
          // Get image URL
          const imageUrl = item.enclosure?.url || item['media:content']?.url || null
          
          // Parse publication date
          let publishedAt: string | null = null
          if (item.pubDate) {
            try {
              publishedAt = new Date(item.pubDate).toISOString()
            } catch {
              publishedAt = null
            }
          }
          
          // Insert article (ignore duplicates)
          const { error: insertError } = await supabase
            .from('articles')
            .upsert({
              source_id: source.id,
              title: item.title,
              description: item.description || null,
              url: item.link,
              image_url: imageUrl,
              published_at: publishedAt,
              category: source.category,
              detected_regions: detectedRegions,
              is_breaking: false
            }, {
              onConflict: 'url',
              ignoreDuplicates: true
            })
          
          if (!insertError) {
            articlesAdded++
          }
        }
        
        // Update last_crawled_at
        await supabase
          .from('sources')
          .update({ last_crawled_at: new Date().toISOString() })
          .eq('id', source.id)
          
      } catch (err) {
        errorMessage = err instanceof Error ? err.message : 'Unknown error'
        console.error(`Error crawling ${source.name}:`, errorMessage)
      }
      
      // Log crawl result
      await supabase
        .from('crawl_logs')
        .insert({
          source_id: source.id,
          status: errorMessage ? 'error' : 'success',
          articles_found: articlesFound,
          articles_added: articlesAdded,
          error_message: errorMessage
        })
      
      results.push({
        source: source.name,
        status: errorMessage ? 'error' : 'success',
        articlesFound,
        articlesAdded,
        error: errorMessage
      })
    }
    
    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Crawl error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})