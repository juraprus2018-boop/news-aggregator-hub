import { AppSidebar } from './AppSidebar'
import { Header } from '@/components/news/Header'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface MainLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
}

export function MainLayout({ children, showSidebar = true }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Full-width header */}
      <Header />
      
      {/* Content area */}
      <div className="container flex flex-1 py-4 md:py-8 gap-4 md:gap-8 px-3 md:px-4">
        {/* Sidebar for desktop */}
        {showSidebar && <AppSidebar />}
        
        {/* Main content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile sidebar trigger */}
      {showSidebar && (
        <div className="md:hidden fixed bottom-4 left-4 z-50">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" className="rounded-full shadow-lg">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-4">
              <MobileSidebar />
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  )
}

// Mobile version of sidebar content
function MobileSidebar() {
  return (
    <div className="pt-8">
      <AppSidebar />
    </div>
  )
}
