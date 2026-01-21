import { useArticles } from '@/hooks/useArticles'
import { ArticleCard } from './ArticleCard'
import { Skeleton } from '@/components/ui/skeleton'
import type { Category } from '@/types/news'

interface ArticleGridProps {
  category: Category
  region?: string
}

export function ArticleGrid({ category, region }: ArticleGridProps) {
  const { data: articles, isLoading, error } = useArticles({ category, region })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Er ging iets mis bij het laden van artikelen.</p>
      </div>
    )
  }

  if (!articles?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Geen artikelen gevonden. Probeer een andere filter.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}
