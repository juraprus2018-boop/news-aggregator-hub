import { useParams, Link } from 'react-router-dom'
import { format } from 'date-fns'
import { nl } from 'date-fns/locale'
import { ArrowLeft, ExternalLink, MapPin, Clock, Building2 } from 'lucide-react'
import { useArticle } from '@/hooks/useArticle'
import { SEOHead } from '@/components/seo/SEOHead'
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd'
import { RelatedArticles } from '@/components/news/RelatedArticles'
import { ShareButtons } from '@/components/news/ShareButtons'
import { Footer } from '@/components/layout/Footer'
import { MainLayout } from '@/components/layout/MainLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const categoryColors: Record<string, string> = {
  nederland: 'bg-orange-500/90',
  internationaal: 'bg-blue-500/90',
  tech: 'bg-purple-500/90',
  algemeen: 'bg-gray-500/90',
}

const categoryLabels: Record<string, string> = {
  nederland: 'Nederland',
  internationaal: 'Internationaal',
  tech: 'Tech',
  algemeen: 'Algemeen',
}

export default function Article() {
  const { slug } = useParams<{ slug: string }>()
  const { data: article, isLoading, error } = useArticle(slug)
  
  const currentUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : ''

  if (isLoading) {
    return (
      <MainLayout showSidebar={false}>
        <main className="container py-8 max-w-4xl">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-6 w-64 mb-8" />
          <Skeleton className="h-96 w-full mb-8" />
          <Skeleton className="h-48 w-full" />
        </main>
      </MainLayout>
    )
  }

  if (error || !article) {
    return (
      <MainLayout showSidebar={false}>
        <main className="container py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Artikel niet gevonden</h1>
            <p className="text-muted-foreground mb-8">
              Dit artikel bestaat niet of is verwijderd.
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Terug naar home
              </Button>
            </Link>
          </div>
        </main>
      </MainLayout>
    )
  }

  return (
    <MainLayout showSidebar={false}>
      <SEOHead
        title={article.title}
        description={article.description || article.title}
        image={article.image_url}
        url={currentUrl}
        type="article"
        publishedTime={article.published_at}
        author={article.source?.name}
        section={article.category}
      />
      <ArticleJsonLd article={article} url={currentUrl} />
      
      <main className="container py-8 max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/?category=${article.category}`}>
                  {categoryLabels[article.category] || article.category}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[200px] truncate">
                {article.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Category Badge */}
        <Badge className={`${categoryColors[article.category] || categoryColors.algemeen} mb-4`}>
          {categoryLabels[article.category] || article.category}
        </Badge>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
          {article.title}
        </h1>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          {article.source && (
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              <span>{article.source.name}</span>
            </div>
          )}
          {article.published_at && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <time dateTime={article.published_at}>
                {format(new Date(article.published_at), "d MMMM yyyy 'om' HH:mm", { locale: nl })}
              </time>
            </div>
          )}
        </div>

        {/* Share Buttons */}
        <div className="mb-6">
          <ShareButtons 
            url={currentUrl} 
            title={article.title} 
            description={article.description || undefined}
          />
        </div>

        {/* Regions */}
        {article.detected_regions && article.detected_regions.length > 0 && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            {article.detected_regions.map((region) => (
              <Badge key={region} variant="secondary">
                {region}
              </Badge>
            ))}
          </div>
        )}

        {/* Hero Image with source attribution */}
        {article.image_url && (
          <div className="relative rounded-xl overflow-hidden mb-6">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-auto max-h-[500px] object-contain bg-muted"
              style={{ imageRendering: 'auto' }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <p className="text-white/80 text-xs">
                📷 Afbeelding: {article.source?.name}
              </p>
            </div>
          </div>
        )}

        {/* Description / Lead */}
        {article.description && (
          <p className="text-xl text-muted-foreground leading-relaxed mb-6 border-l-4 border-primary pl-4">
            {article.description}
          </p>
        )}

        {/* Primary CTA - Read full article */}
        <div className="bg-muted/50 rounded-xl p-6 mb-8 border border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-medium mb-1">Lees het volledige artikel</p>
              <p className="text-sm text-muted-foreground">
                Dit is een samenvatting. Bezoek {article.source?.name} voor het complete verhaal.
              </p>
            </div>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0"
            >
              <Button size="lg" className="gap-2">
                Lees bij {article.source?.name}
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>

        {/* Copyright notice */}
        <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-4 mb-8">
          <p>
            📰 Dit artikel is afkomstig van <strong>{article.source?.name}</strong> en wordt hier getoond 
            als samenvatting via hun publieke RSS-feed. Alle rechten behoren toe aan de oorspronkelijke 
            uitgever. <a href={article.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
              Bekijk het origineel →
            </a>
          </p>
        </div>

        {/* Related Articles */}
        <RelatedArticles 
          articleId={article.id} 
          category={article.category}
          regions={article.detected_regions || []}
        />

        {/* Back button */}
        <div className="mt-12">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Terug naar overzicht
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </MainLayout>
  )
}
