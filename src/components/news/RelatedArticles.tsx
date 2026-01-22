import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { nl } from 'date-fns/locale'
import { useRelatedArticles } from '@/hooks/useRelatedArticles'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Article } from '@/types/news'

interface RelatedArticlesProps {
  articleId: string
  category: string
  regions?: string[]
}

const categoryColors: Record<string, string> = {
  nederland: 'bg-orange-500/90',
  internationaal: 'bg-blue-500/90',
  tech: 'bg-purple-500/90',
  algemeen: 'bg-gray-500/90',
}

function RelatedArticleCard({ article }: { article: Article & { source: { id: string; name: string; url: string } } }) {
  return (
    <Link to={`/artikel/${article.slug || article.id}`} className="group block">
      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 bg-card border-border/50">
        {article.image_url && (
          <div className="relative h-32 overflow-hidden">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute top-2 left-2">
              <Badge className={`${categoryColors[article.category] || categoryColors.algemeen} text-xs`}>
                {article.category}
              </Badge>
            </div>
          </div>
        )}
        <div className="p-3">
          {!article.image_url && (
            <Badge className={`${categoryColors[article.category] || categoryColors.algemeen} mb-2 text-xs`}>
              {article.category}
            </Badge>
          )}
          <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {article.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{article.source?.name}</span>
            {article.published_at && (
              <>
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(article.published_at), {
                    addSuffix: true,
                    locale: nl,
                  })}
                </span>
              </>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}

function RelatedArticleSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-32 w-full" />
      <div className="p-3">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </Card>
  )
}

export function RelatedArticles({ articleId, category, regions }: RelatedArticlesProps) {
  const { data: articles, isLoading } = useRelatedArticles({
    articleId,
    category,
    regions,
    limit: 4,
  })

  if (isLoading) {
    return (
      <section className="mt-12">
        <h2 className="text-xl font-bold mb-6">Gerelateerde artikelen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <RelatedArticleSkeleton key={i} />
          ))}
        </div>
      </section>
    )
  }

  if (!articles || articles.length === 0) {
    return null
  }

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold mb-6">Gerelateerde artikelen</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {articles.map((article) => (
          <RelatedArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  )
}
