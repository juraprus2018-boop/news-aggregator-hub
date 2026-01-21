import { useHeroArticles } from '@/hooks/useArticles'
import { formatDistanceToNow } from 'date-fns'
import { nl } from 'date-fns/locale'
import { ExternalLink } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

const categoryColors: Record<string, string> = {
  nederland: 'bg-orange-500/90 hover:bg-orange-500',
  internationaal: 'bg-blue-500/90 hover:bg-blue-500',
  tech: 'bg-purple-500/90 hover:bg-purple-500',
  algemeen: 'bg-gray-500/90 hover:bg-gray-500',
}

export function HeroSection() {
  const { data: articles, isLoading } = useHeroArticles()

  if (isLoading) {
    return (
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <Skeleton className="h-[400px] rounded-2xl" />
        <div className="grid grid-rows-2 gap-4">
          <Skeleton className="h-[192px] rounded-2xl" />
          <Skeleton className="h-[192px] rounded-2xl" />
        </div>
      </section>
    )
  }

  if (!articles?.length) {
    return null
  }

  const [main, ...secondary] = articles

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
      {/* Main hero article */}
      <a
        href={main.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative h-[400px] rounded-2xl overflow-hidden bg-card"
      >
        {main.image_url && (
          <img
            src={main.image_url}
            alt={main.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Badge className={categoryColors[main.category] || categoryColors.algemeen}>
              {main.category}
            </Badge>
            {main.detected_regions?.slice(0, 2).map((region) => (
              <Badge key={region} variant="outline" className="bg-white/10 border-white/20 text-white">
                {region}
              </Badge>
            ))}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-3 group-hover:underline">
            {main.title}
          </h2>
          <div className="flex items-center gap-3 text-white/70 text-sm">
            <span className="font-medium">{main.source?.name}</span>
            {main.published_at && (
              <>
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(main.published_at), {
                    addSuffix: true,
                    locale: nl,
                  })}
                </span>
              </>
            )}
            <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </a>

      {/* Secondary articles */}
      <div className="grid grid-rows-2 gap-4">
        {secondary.map((article) => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative h-[192px] rounded-2xl overflow-hidden bg-card"
          >
            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <Badge className={`${categoryColors[article.category] || categoryColors.algemeen} mb-2`}>
                {article.category}
              </Badge>
              <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:underline">
                {article.title}
              </h3>
              <div className="flex items-center gap-2 text-white/70 text-xs mt-1">
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
          </a>
        ))}
      </div>
    </section>
  )
}
