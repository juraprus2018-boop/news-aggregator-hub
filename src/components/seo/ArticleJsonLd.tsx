import { Helmet } from 'react-helmet-async'
import type { Article } from '@/types/news'

interface ArticleJsonLdProps {
  article: Article & { source?: { id: string; name: string; url: string } }
  url: string
}

export function ArticleJsonLd({ article, url }: ArticleJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description || article.title,
    image: article.image_url ? [article.image_url] : undefined,
    datePublished: article.published_at,
    dateModified: article.published_at,
    author: {
      '@type': 'Organization',
      name: article.source?.name || 'NewsFlow',
      url: article.source?.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'NewsFlow',
      logo: {
        '@type': 'ImageObject',
        url: `${window.location.origin}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: article.category,
    keywords: article.detected_regions?.join(', '),
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  )
}
