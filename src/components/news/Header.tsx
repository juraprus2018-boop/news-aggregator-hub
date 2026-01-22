import { Newspaper, Moon, Sun, Flame, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { useBreakingNews } from '@/hooks/useArticles'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { nl } from 'date-fns/locale'

export function Header() {
  const [isDark, setIsDark] = useState(false)
  const { data: breakingNews, isLoading } = useBreakingNews()

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
  }, [])

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark')
    setIsDark(!isDark)
  }

  const todaysNews = breakingNews?.filter(article => {
    if (!article.published_at) return false
    const publishedDate = new Date(article.published_at)
    const today = new Date()
    return publishedDate.toDateString() === today.toDateString()
  }) || []

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">GigaNieuws</h1>
            <p className="text-xs text-muted-foreground">Al het nieuws, één plek</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="default" 
                size="sm" 
                className="gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                <Flame className="w-4 h-4" />
                <span className="hidden sm:inline">Belangrijk Nieuws</span>
                {todaysNews.length > 0 && (
                  <Badge variant="secondary" className="ml-1 bg-white/20 text-white text-xs px-1.5">
                    {todaysNews.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-3 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <Flame className="w-4 h-4 text-destructive" />
                  Belangrijk Nieuws Vandaag
                </h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Laden...
                  </div>
                ) : todaysNews.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Geen belangrijk nieuws vandaag
                  </div>
                ) : (
                  <div className="divide-y">
                    {todaysNews.map((article) => (
                      <a
                        key={article.id}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm line-clamp-2 group-hover:text-primary">
                              {article.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
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
                          <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </header>
  )
}
