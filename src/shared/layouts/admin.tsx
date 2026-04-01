import { type ReactElement } from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar"
import { cn } from "@/shared/lib/utils"
import { LayoutDashboardIcon, NewspaperIcon, ShieldIcon } from "lucide-react"

type AdminNavItem = {
  readonly to: string
  readonly label: string
  readonly icon: ReactElement
  readonly isActive: (pathname: string) => boolean
}

const ADMIN_NAV_ITEMS: readonly AdminNavItem[] = [
  {
    to: "/admin",
    label: "ダッシュボード",
    icon: <LayoutDashboardIcon />,
    isActive: (pathname: string) => pathname === "/admin",
  },
  {
    to: "/admin/posts",
    label: "投稿",
    icon: <NewspaperIcon />,
    isActive: (pathname: string) => pathname.startsWith("/admin/posts"),
  },
] as const

function AdminSidebarNav(): ReactElement {
  const { pathname } = useLocation()
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="p-0">
        <div className="flex h-14 items-center gap-2 px-3">
          <div className="grid size-8 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <ShieldIcon className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold leading-tight">
              管理画面
            </div>
            <div className="truncate text-xs text-sidebar-foreground/70">
              コントロールパネル
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>ナビゲーション</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ADMIN_NAV_ITEMS.map((item: AdminNavItem) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    isActive={item.isActive(pathname)}
                    render={<NavLink to={item.to} end />}
                    className={cn(
                      "data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground"
                    )}
                    tooltip={item.label}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

function AdminHeader(): ReactElement {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center gap-2 px-3 md:px-4">
        <SidebarTrigger className="md:hidden" />
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="hidden md:block">
            <SidebarTrigger />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold leading-tight">
              管理画面
            </div>
            <div className="truncate text-xs text-muted-foreground">
              概要と管理
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export function LayoutAdmin(): ReactElement {
  return (
    <SidebarProvider defaultOpen>
      <AdminSidebarNav />
      <SidebarInset className="h-svh">
        <AdminHeader />
        <div className="min-h-0 flex-1 overflow-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

