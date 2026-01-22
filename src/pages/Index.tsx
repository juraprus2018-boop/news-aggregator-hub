import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Header } from '@/components/news/Header'
import { HeroSection } from '@/components/news/HeroSection'
import { FilterBar } from '@/components/news/FilterBar'
import { ArticleGrid } from '@/components/news/ArticleGrid'
import { Footer } from '@/components/layout/Footer'
import { MainLayout } from '@/components/layout/MainLayout'
import { useUserLocation } from '@/hooks/useUserLocation'
import type { Category } from '@/types/news'

const Index = () => {
  const { suggestedCategory, isLoading: locationLoading } = useUserLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')

  // Get category and region from URL params
  const urlCategory = searchParams.get('category') as Category | null
  const urlRegion = searchParams.get('region') || undefined

  // Set initial category based on detected location (only if no URL param)
  const [initialized, setInitialized] = useState(false)
  
  useEffect(() => {
    if (!locationLoading && !initialized && !urlCategory && !urlRegion) {
      if (suggestedCategory && suggestedCategory !== 'all') {
        setSearchParams({ category: suggestedCategory })
      }
      setInitialized(true)
    }
  }, [locationLoading, suggestedCategory, initialized, urlCategory, urlRegion, setSearchParams])

  const activeCategory: Category = urlCategory || 'all'

  const handleCategoryChange = (category: Category) => {
    if (category === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ category })
    }
  }

  const handleRegionChange = (region: string | undefined) => {
    if (region) {
      setSearchParams({ region })
    } else {
      const newParams: Record<string, string> = {}
      if (urlCategory) newParams.category = urlCategory
      setSearchParams(newParams)
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container py-8 flex-1">
          <HeroSection />
          <FilterBar
            selectedCategory={activeCategory}
            selectedRegion={urlRegion}
            searchQuery={search}
            onCategoryChange={handleCategoryChange}
            onRegionChange={handleRegionChange}
            onSearchChange={setSearch}
          />
          <ArticleGrid category={activeCategory} region={urlRegion} search={search} />
        </main>
        <Footer />
      </div>
    </MainLayout>
  )
}

export default Index
