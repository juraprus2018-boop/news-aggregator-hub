import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Newspaper, LogOut, Home, Settings, Activity, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAdminCheck } from '@/hooks/useAdminCheck'
import { useAuth } from '@/hooks/useAuth'
import { CrawlStats } from '@/components/admin/CrawlStats'
import { CrawlLogsTable } from '@/components/admin/CrawlLogsTable'
import { SourcesTable } from '@/components/admin/SourcesTable'
import { CommentsTable } from '@/components/admin/CommentsTable'
import { useToast } from '@/hooks/use-toast'

export default function Admin() {
  const { isAdmin, loading, user } = useAdminCheck()
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login')
    }
  }, [loading, user, isAdmin, navigate])

  const handleSignOut = async () => {
    await signOut()
    toast({ title: 'Uitgelogd' })
    navigate('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Laden...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">GigaNieuws Admin</h1>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-2" />
              Naar site
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Uitloggen
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Beheer nieuwsbronnen en bekijk crawl statistieken
          </p>
        </div>

        <div className="mb-8">
          <CrawlStats />
        </div>

        <Tabs defaultValue="sources" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sources" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Bronnen
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Reacties
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Crawl Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sources">
            <SourcesTable />
          </TabsContent>

          <TabsContent value="comments">
            <CommentsTable />
          </TabsContent>

          <TabsContent value="logs">
            <CrawlLogsTable />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
