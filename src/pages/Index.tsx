import { useState, useEffect } from 'react'
import { Header } from '@/components/news/Header'
import { HeroSection } from '@/components/news/HeroSection'
import { FilterBar } from '@/components/news/FilterBar'
import { ArticleGrid } from '@/components/news/ArticleGrid'
import { useUserLocation } from '@/hooks/useUserLocation'
import type { Category } from '@/types/news'

const Index = () => {
  const { suggestedCategory, isLoading: locationLoading } = useUserLocation()
  const [category, setCategory] = useState<Category | null>(null)
  const [region, setRegion] = useState<string | undefined>(undefined)
  const [search, setSearch] = useState('')

  // Set initial category based on detected location
  useEffect(() => {
    if (!locationLoading && category === null) {
      setCategory(suggestedCategory)
    }
  }, [locationLoading, suggestedCategory, category])

  const activeCategory = category ?? 'all'

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <HeroSection />
        <FilterBar
          selectedCategory={activeCategory}
          selectedRegion={region}
          searchQuery={search}
          onCategoryChange={setCategory}
          onRegionChange={setRegion}
          onSearchChange={setSearch}
        />
        <ArticleGrid category={activeCategory} region={region} search={search} />
      </main>
      <footer className="border-t border-border py-8 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 NewsFlow — Al het nieuws, één plek</p>
          <p className="mt-1">Artikelen worden automatisch verzameld via RSS feeds</p>
        </div>
      </footer>
    </div>
  )
}

export default Index
