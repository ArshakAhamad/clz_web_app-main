import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { NavMain } from "@/components/Sidebar/nav-main"
import { NavUser } from "@/components/Sidebar/nav-user"
import { NavContent } from "@/components/Sidebar/nav-content"

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <NavContent />
      </SidebarContent>
      <SidebarFooter>
        <NavMain />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}