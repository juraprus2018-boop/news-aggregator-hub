import { Activity, CheckCircle, XCircle, FileText, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCrawlStats } from '@/hooks/useCrawlLogs'

export function CrawlStats() {
  const { data: stats, isLoading } = useCrawlStats()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: 'Crawls (24u)',
      value: stats?.totalCrawls ?? 0,
      icon: Activity,
      description: 'Totaal aantal crawls'
    },
    {
      title: 'Succesvol',
      value: stats?.successfulCrawls ?? 0,
      icon: CheckCircle,
      description: 'Succesvolle crawls',
      className: 'text-green-600'
    },
    {
      title: 'Mislukt',
      value: stats?.failedCrawls ?? 0,
      icon: XCircle,
      description: 'Mislukte crawls',
      className: 'text-destructive'
    },
    {
      title: 'Artikelen toegevoegd',
      value: stats?.totalArticlesAdded ?? 0,
      icon: Plus,
      description: 'Nieuwe artikelen (24u)'
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 text-muted-foreground ${stat.className || ''}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
