import { AppSidebar } from './AppSidebar'
import { Header } from '@/components/news/Header'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface MainLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
}

export function MainLayout({ children, showSidebar = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Full-width header */}
      <Header />
      
      {/* Content area */}
      <div className="container flex flex-1 py-4 md:py-8 gap-4 md:gap-8 px-3 md:px-4">
        {/* Sidebar for desktop */}
        {showSidebar && <AppSidebar />}
        
        {/* Main content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile sidebar trigger */}
      {showSidebar && (
        <div className="md:hidden fixed bottom-4 left-4 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" className="rounded-full shadow-lg">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-4">
              <MobileSidebar />
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  )
}

// Mobile version of sidebar content
function MobileSidebar() {
  return (
    <div className="pt-8">
      <MobileSidebarContent />
    </div>
  )
}

// Duplicated sidebar content without hidden class for mobile
import { useSearchParams, Link } from 'react-router-dom'
import { Globe, Laptop, MapPin, Newspaper, ChevronDown, Trophy, TrendingUp, Clapperboard, Clock, Flame } from 'lucide-react'
import { useRegions } from '@/hooks/useRegions'
import { useBreakingNews } from '@/hooks/useArticles'
import { NavLink } from '@/components/NavLink'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { nl } from 'date-fns/locale'

const mobileCategories = [
  { value: 'all', label: 'Alles', icon: Newspaper },
  { value: 'nederland', label: 'Nederland', icon: MapPin },
  { value: 'internationaal', label: 'Internationaal', icon: Globe },
  { value: 'tech', label: 'Tech', icon: Laptop },
  { value: 'sport', label: 'Sport', icon: Trophy },
  { value: 'economie', label: 'Economie', icon: TrendingUp },
  { value: 'entertainment', label: 'Entertainment', icon: Clapperboard },
]

function MobileSidebarContent() {
  const { data: regions } = useRegions()
  const { data: trendingArticles } = useBreakingNews()
  const [searchParams] = useSearchParams()
  
  const currentCategory = searchParams.get('category') || 'all'
  const currentRegion = searchParams.get('region')

  return (
    <div className="space-y-6">
      {/* Top 24 uur link */}
      <Link
        to="/?filter=top24"
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium',
          searchParams.get('filter') === 'top24'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted/50 hover:bg-muted text-foreground'
        )}
      >
        <Clock className="w-4 h-4 shrink-0" />
        <span>Top afgelopen 24 uur</span>
      </Link>

      {/* Trending Articles */}
      {trendingArticles && trendingArticles.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-3 mb-2 flex items-center gap-2">
            <Flame className="w-3 h-3 text-destructive" />
            Trending
          </h3>
          <div className="space-y-2">
            {trendingArticles.slice(0, 5).map((article, index) => (
              <Link
                key={article.id}
                to={`/artikel/${article.slug || article.id}`}
                className="block px-3 py-2 rounded-lg hover:bg-muted transition-colors group"
              >
                <div className="flex gap-2">
                  <span className="text-lg font-bold text-muted-foreground/50 shrink-0">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {article.published_at && formatDistanceToNow(new Date(article.published_at), {
                        addSuffix: true,
                        locale: nl,
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div>
        <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-3 mb-2">
          Categorieën
        </h3>
        <nav className="space-y-1">
          {mobileCategories.map((cat) => {
            const isActive = currentCategory === cat.value && !currentRegion && !searchParams.get('filter')
            const Icon = cat.icon
            return (
              <NavLink
                key={cat.value}
                to={cat.value === 'all' ? '/' : `/?category=${cat.value}`}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
                )}
                activeClassName=""
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{cat.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Regions */}
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between px-3 mb-2 group">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Regio's
          </h3>
          <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <nav className="space-y-1">
            {regions?.map((region) => {
              const isActive = currentRegion === region.name
              return (
                <NavLink
                  key={region.id}
                  to={`/?region=${encodeURIComponent(region.name)}`}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-foreground'
                  )}
                  activeClassName=""
                >
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="truncate">{region.name}</span>
                </NavLink>
              )
            })}
          </nav>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
