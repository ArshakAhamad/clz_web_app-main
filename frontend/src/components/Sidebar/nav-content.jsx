import { BookOpen, Bot, ChevronRight, Home, Settings2, UserCheck, QrCode } from "lucide-react"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    isActive: true,
  },
  {
    title: "Mark Attendance",
    url: "/attendance",
    icon: UserCheck,
    items: [
      { title: "Today Classes", url: "/attendance" },
      { title: "All Classes", url: "#" }
    ],
  },
  {
    title: "Classes",
    url: "/classes",
    icon: Bot,
  },
  {
    title: "QR Codes",
    url: "#",
    icon: QrCode,
    items: [
      { title: "Generate New QR Code", url: "/generate-qr" },
      { title: "All QR Codes", url: "/all-qr" }
    ],
  },
  
  {
    title: "Staff",
    url: "/staff",
    icon: BookOpen,
  },
  {
    title: "Students",
    url: "/students",
    icon: Settings2,
  },
]

export function NavContent() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {navItems.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                <a href={item.url}>
                  <span>{item.title}</span>
                </a>
                  {item.items && (
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              {item.items && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}