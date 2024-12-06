"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { StoreIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenuSkeleton,
  SidebarInset,
} from "@/components/ui/sidebar";
import { SIDEBAR } from "@/constants/sidebar";

export function WorkspaceLayout({
  children,
  info,
}: {
  children: React.ReactNode;
  info: any;
}) {
  const pathname = usePathname();

  const menuItems = SIDEBAR[info?.role as keyof typeof SIDEBAR];

  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="flex h-screen overflow-hidden">
          <Sidebar>
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg" asChild>
                    <Link href="/">
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <StoreIcon className="size-4" />
                      </div>
                      <div className="flex flex-col gap-0.5 leading-none">
                        <span className="font-semibold">EzStore</span>
                        <span className="text-xs text-muted-foreground">
                          Manage your app
                        </span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="px-2">
              <React.Suspense
                fallback={<NavProjectsSkeleton length={menuItems?.length} />}
              >
                <SidebarMenu>
                  {menuItems?.map((item: any) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                      >
                        <Link href={item.href}>
                          <item.icon className="mr-2 h-4 w-4" />
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </React.Suspense>
            </SidebarContent>
          </Sidebar>
          <div className={`flex-1 overflow-auto`}>
            <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
              <SidebarTrigger />
              <div className="font-semibold">EzStore</div>
            </header>
            <main className="flex-1 overflow-auto p-6">{children}</main>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function NavProjectsSkeleton({ length = 5 }: { length?: number }) {
  return (
    <SidebarMenu>
      {Array.from({ length }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuSkeleton showIcon />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
