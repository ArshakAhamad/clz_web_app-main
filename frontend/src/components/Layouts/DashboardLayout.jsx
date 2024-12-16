import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Sidebar/app-sidebar"
import { Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <Outlet />
      </div>
    </SidebarProvider>
  )
}