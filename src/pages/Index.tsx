import { useState } from 'react'
import { Header } from '@/components/news/Header'
import { HeroSection } from '@/components/news/HeroSection'
import { FilterBar } from '@/components/news/FilterBar'
import { ArticleGrid } from '@/components/news/ArticleGrid'
import type { Category } from '@/types/news'

const Index = () => {
  const [category, setCategory] = useState<Category>('all')
  const [region, setRegion] = useState<string | undefined>(undefined)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <HeroSection />
        <FilterBar
          selectedCategory={category}
          selectedRegion={region}
          onCategoryChange={setCategory}
          onRegionChange={setRegion}
        />
        <ArticleGrid category={category} region={region} />
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
