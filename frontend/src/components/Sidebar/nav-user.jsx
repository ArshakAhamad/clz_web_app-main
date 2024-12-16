import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"

const userData = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "/placeholder.svg?height=32&width=32",
}

export function NavUser() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="font-semibold">{userData.name}</span>
            <span className="text-xs text-muted-foreground">
              {userData.email}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}