import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { nl } from 'date-fns/locale'
import { ChevronRight, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { Article } from '@/types/news'
import placeholderNews from '@/assets/placeholder-news.jpg'

const categoryColors: Record<string, string> = {
  nederland: 'bg-orange-500/90 hover:bg-orange-500',
  internationaal: 'bg-blue-500/90 hover:bg-blue-500',
  tech: 'bg-purple-500/90 hover:bg-purple-500',
  algemeen: 'bg-gray-500/90 hover:bg-gray-500',
}

interface ArticleCardProps {
  article: Article & { source?: { id: string; name: string; url: string } }
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [imgError, setImgError] = useState(false)
  const imageSrc = imgError || !article.image_url ? placeholderNews : article.image_url

  return (
    <Link
      to={`/artikel/${article.slug || article.id}`}
      className="group block"
    >
      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card border-border/50">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageSrc}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
          <div className="absolute top-3 left-3">
            <Badge className={categoryColors[article.category] || categoryColors.algemeen}>
              {article.category}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          {article.description && (
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {article.description}
            </p>
          )}
          {article.detected_regions && article.detected_regions.length > 0 && (
            <div className="flex items-center gap-1 mb-3 flex-wrap">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              {article.detected_regions.slice(0, 3).map((region) => (
                <Badge key={region} variant="secondary" className="text-xs">
                  {region}
                </Badge>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-medium">{article.source?.name}</span>
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
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </Card>
    </Link>
  )
}
