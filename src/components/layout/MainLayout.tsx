import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex-1 flex flex-col min-h-screen">
        {/* Mobile sidebar trigger */}
        <div className="md:hidden fixed bottom-4 left-4 z-50">
          <SidebarTrigger className="bg-primary text-primary-foreground shadow-lg rounded-full p-3 hover:bg-primary/90" />
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
