"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FolderKanban,
  Moon,
  Sun,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: UserPlus, badge: true },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/projects", label: "Projects", icon: FolderKanban },
];

interface SidebarProps {
  unreadLeads?: number;
}

export function Sidebar({ unreadLeads = 0 }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen bg-card border-r border-border transition-all duration-300 sticky top-0",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <span className="text-primary-foreground font-bold text-sm">A</span>
        </div>
        {!collapsed && (
          <span className="font-semibold text-lg tracking-tight">Agency CRM</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.badge && unreadLeads > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-auto h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                >
                  {unreadLeads}
                </Badge>
              )}
              {collapsed && item.badge && unreadLeads > 0 && (
                <div className="absolute right-1 top-0 w-2 h-2 bg-destructive rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Bottom */}
      <div className="p-2 space-y-1">
        {mounted && (
          <Button
            variant="ghost"
            size="sm"
            className={cn("w-full", collapsed ? "justify-center" : "justify-start")}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 shrink-0" />
            ) : (
              <Moon className="w-4 h-4 shrink-0" />
            )}
            {!collapsed && (
              <span className="ml-2">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            )}
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className={cn("w-full", collapsed ? "justify-center" : "justify-start")}
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft
            className={cn(
              "w-4 h-4 shrink-0 transition-transform",
              collapsed && "rotate-180"
            )}
          />
          {!collapsed && <span className="ml-2">Collapse</span>}
        </Button>
        <Link href="/login">
          <Button
            variant="ghost"
            size="sm"
            className={cn("w-full text-muted-foreground", collapsed ? "justify-center" : "justify-start")}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="ml-2">Log Out</span>}
          </Button>
        </Link>
      </div>
    </aside>
  );
}
