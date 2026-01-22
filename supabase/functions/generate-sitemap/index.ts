import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SITE_URL = 'https://giganieuws.nl'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Fetch all articles
    const { data: articles, error } = await supabase
      .from('articles')
      .select('id, title, published_at, updated_at')
      .order('published_at', { ascending: false })
      .limit(5000)
    
    if (error) throw error
    
    const now = new Date().toISOString()
    
    // Build sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static pages -->
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/privacy</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${SITE_URL}/disclaimer</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${SITE_URL}/contact</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
`
    
    // Add article URLs
    for (const article of articles || []) {
      const lastmod = article.updated_at || article.published_at || now
      sitemap += `  <url>
    <loc>${SITE_URL}/artikel/${article.id}</loc>
    <lastmod>${new Date(lastmod).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`
    }
    
    sitemap += `</urlset>`
    
    // Store sitemap in database for caching
    await supabase
      .from('site_settings')
      .upsert({
        key: 'sitemap_xml',
        value: sitemap,
        updated_at: now
      }, {
        onConflict: 'key'
      })
    
    console.log(`Sitemap generated with ${(articles?.length || 0) + 4} URLs`)
    
    return new Response(sitemap, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=600'
      }
    })
    
  } catch (error) {
    console.error('Sitemap generation error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
