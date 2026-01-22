import { useSearchParams } from 'react-router-dom'
import { Globe, Laptop, MapPin, Newspaper, ChevronDown } from 'lucide-react'
import { useRegions } from '@/hooks/useRegions'
import { NavLink } from '@/components/NavLink'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
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
  const { state } = useSidebar()
  const collapsed = state === 'collapsed'
  const { data: regions } = useRegions()
  const [searchParams] = useSearchParams()
  
  const currentCategory = searchParams.get('category') || 'all'
  const currentRegion = searchParams.get('region')

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r border-border/40 bg-muted/30 rounded-lg shrink-0"
    >
      <SidebarContent className="py-4">
        {/* Categories */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-3">
            {!collapsed && 'Categorieën'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categories.map((cat) => {
                const isActive = currentCategory === cat.value && !currentRegion
                const Icon = cat.icon
                return (
                  <SidebarMenuItem key={cat.value}>
                    <SidebarMenuButton asChild tooltip={cat.label}>
                      <NavLink
                        to={cat.value === 'all' ? '/' : `/?category=${cat.value}`}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        )}
                        activeClassName=""
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        {!collapsed && <span>{cat.label}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Regions */}
        <SidebarGroup>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroupLabel asChild className="text-xs uppercase tracking-wider text-muted-foreground font-semibold px-3">
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                {!collapsed && 'Regio\'s'}
                {!collapsed && (
                  <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                )}
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {regions?.map((region) => {
                    const isActive = currentRegion === region.name
                    return (
                      <SidebarMenuItem key={region.id}>
                        <SidebarMenuButton asChild tooltip={region.name}>
                          <NavLink
                            to={`/?region=${encodeURIComponent(region.name)}`}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                              isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                            )}
                            activeClassName=""
                          >
                            <MapPin className="w-4 h-4 shrink-0" />
                            {!collapsed && <span className="truncate">{region.name}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
