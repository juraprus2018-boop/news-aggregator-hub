import { useState, useEffect } from 'react'
import { Header } from '@/components/news/Header'
import { HeroSection } from '@/components/news/HeroSection'
import { FilterBar } from '@/components/news/FilterBar'
import { ArticleGrid } from '@/components/news/ArticleGrid'
import { Footer } from '@/components/layout/Footer'
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
      <Footer />
    </div>
  )
}

export default Index
