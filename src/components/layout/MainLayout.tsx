import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { Header } from '@/components/news/Header'

interface MainLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
}

export function MainLayout({ children, showSidebar = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Full-width header */}
      <Header />
      
      {/* Content area with sidebar */}
      {showSidebar ? (
        <SidebarProvider>
          <div className="container flex flex-1 py-8 gap-8">
            <div className="sticky top-20 h-fit">
              <AppSidebar />
            </div>
            <SidebarInset className="flex-1 min-w-0">
              {children}
            </SidebarInset>
          </div>
          {/* Mobile sidebar trigger */}
          <div className="md:hidden fixed bottom-4 left-4 z-50">
            <SidebarTrigger className="bg-primary text-primary-foreground shadow-lg rounded-full p-3 hover:bg-primary/90" />
          </div>
        </SidebarProvider>
      ) : (
        <div className="container flex-1 py-8">
          {children}
        </div>
      )}
    </div>
  )
}
