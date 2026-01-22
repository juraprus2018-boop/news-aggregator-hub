import { useSearchParams } from 'react-router-dom'
import { Globe, Laptop, MapPin, Newspaper, ChevronDown } from 'lucide-react'
import { useRegions } from '@/hooks/useRegions'
import { NavLink } from '@/components/NavLink'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

const categories = [
  { value: 'all', label: 'Alles', icon: Newspaper },
  { value: 'nederland', label: 'Nederland', icon: MapPin },
  { value: 'internationaal', label: 'Internationaal', icon: Globe },
  { value: 'tech', label: 'Tech', icon: Laptop },
]

export function AppSidebar() {
  const { data: regions } = useRegions()
  const [searchParams] = useSearchParams()
  
  const currentCategory = searchParams.get('category') || 'all'
  const currentRegion = searchParams.get('region')

  return (
    <aside className="hidden md:block w-56 shrink-0">
      <div className="sticky top-20 space-y-6">
        {/* Categories */}
        <div>
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-3 mb-2">
            Categorieën
          </h3>
          <nav className="space-y-1">
            {categories.map((cat) => {
              const isActive = currentCategory === cat.value && !currentRegion
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
    </aside>
  )
}
