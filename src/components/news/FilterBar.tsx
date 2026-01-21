import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRegions } from '@/hooks/useRegions'
import { Globe, Laptop, MapPin, Newspaper } from 'lucide-react'
import type { Category } from '@/types/news'

interface FilterBarProps {
  selectedCategory: Category
  selectedRegion: string | undefined
  onCategoryChange: (category: Category) => void
  onRegionChange: (region: string | undefined) => void
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
  onCategoryChange,
  onRegionChange,
}: FilterBarProps) {
  const { data: regions } = useRegions()

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
  )
}
