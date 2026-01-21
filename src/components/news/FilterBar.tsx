import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRegions } from '@/hooks/useRegions'
import { Globe, Laptop, MapPin, Newspaper, Search, X } from 'lucide-react'
import type { Category } from '@/types/news'

interface FilterBarProps {
  selectedCategory: Category
  selectedRegion: string | undefined
  searchQuery: string
  onCategoryChange: (category: Category) => void
  onRegionChange: (region: string | undefined) => void
  onSearchChange: (search: string) => void
}

const categories: { value: Category; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'Alles', icon: <Newspaper className="w-4 h-4" /> },
  { value: 'nederland', label: 'Nederland', icon: <MapPin className="w-4 h-4" /> },
  { value: 'internationaal', label: 'Internationaal', icon: <Globe className="w-4 h-4" /> },
  { value: 'tech', label: 'Tech', icon: <Laptop className="w-4 h-4" /> },
]

export function FilterBar({
  selectedCategory,
  selectedRegion,
  searchQuery,
  onCategoryChange,
  onRegionChange,
  onSearchChange,
}: FilterBarProps) {
  const { data: regions } = useRegions()
  const [localSearch, setLocalSearch] = useState(searchQuery)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange(localSearch)
  }

  const clearSearch = () => {
    setLocalSearch('')
    onSearchChange('')
  }

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Zoeken in artikelen..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-10 pr-10"
            maxLength={100}
          />
          {localSearch && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Button type="submit" variant="secondary">
          Zoeken
        </Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(cat.value)}
              className="gap-2"
            >
              {cat.icon}
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Region filter */}
        <div className="sm:ml-auto">
          <Select
            value={selectedRegion || 'all'}
            onValueChange={(value) => onRegionChange(value === 'all' ? undefined : value)}
          >
            <SelectTrigger className="w-[200px]">
              <MapPin className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter op regio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle regio's</SelectItem>
              {regions?.map((region) => (
                <SelectItem key={region.id} value={region.name}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
