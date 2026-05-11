import { ReactNode, useState } from "react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import {
  GraduationCap,
  LogOut,
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Users,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { clearStudentSession, getStoredStudentToken } from "@/hooks/useStudentAuth";
import { cn } from "@/lib/utils";

export interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  badge?: number;
}

export function DashboardLayout({
  roleLabel,
  navItems,
  userName,
  children,
}: {
  roleLabel: string;
  navItems: NavItem[];
  userName?: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout() {
    if (getStoredStudentToken()) {
      clearStudentSession();
    } else {
      const isTeacher =
        roleLabel.toLowerCase().includes("teacher") || roleLabel.includes("معلم");
      if (isTeacher) {
        // Navigate away before signOut triggers dashboard guard redirects.
        navigate({ to: "/" });
      }
      await supabase.auth.signOut();
    }
    navigate({ to: "/" });
  }

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-l border-border/60 bg-card/30 backdrop-blur sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-border/60">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow-primary">
              <GraduationCap className="size-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold leading-tight">
                Edu<span className="text-gradient-primary">Verse</span>
              </span>
              <span className="text-[10px] text-muted-foreground">{roleLabel}</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.to, item.exact);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                <item.icon className="size-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-5 h-5 px-1.5 grid place-items-center">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border/60">
          {userName && (
            <div className="px-3 py-2 text-xs text-muted-foreground truncate">{userName}</div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition"
          >
            <LogOut className="size-4" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-card border-l border-border/60 flex flex-col">
            <div className="px-5 py-5 border-b border-border/60 flex items-center justify-between">
              <span className="font-bold">القائمة</span>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded hover:bg-white/5">
                <X className="size-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.to, item.exact);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && item.badge > 0 ? (
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-5 h-5 px-1.5 grid place-items-center">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-border/60">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition"
              >
                <LogOut className="size-4" />
                تسجيل الخروج
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden border-b border-border/60 bg-card/40 backdrop-blur sticky top-0 z-40">
          <div className="px-4 py-3 flex items-center justify-between">
            <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-white/5">
              <Menu className="size-5" />
            </button>
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="size-7 rounded-lg bg-gradient-primary grid place-items-center">
                <GraduationCap className="size-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-sm">EduVerse</span>
            </Link>
            <span className="text-[10px] px-2 py-1 rounded-full glass text-muted-foreground">{roleLabel}</span>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-10 max-w-7xl mx-auto w-full">{children}</div>;
}
