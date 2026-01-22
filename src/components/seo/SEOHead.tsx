import { Helmet } from 'react-helmet-async'

interface SEOHeadProps {
  title: string
  description: string
  image?: string | null
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string | null
  author?: string
  section?: string
}

export function SEOHead({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  author,
  section,
}: SEOHeadProps) {
  const siteName = 'GigaNieuws'
  const fullTitle = `${title} | ${siteName}`
  const truncatedDescription = description.length > 155 
    ? description.substring(0, 152) + '...' 
    : description

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={truncatedDescription} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={truncatedDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      
      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={truncatedDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  )
}
