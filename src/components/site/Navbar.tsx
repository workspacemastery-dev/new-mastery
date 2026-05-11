import { Link } from "@tanstack/react-router";
import { GraduationCap, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { useAuth, dashboardPathForRole } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export function Navbar() {
  const { user, role, loading } = useAuth();

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-6 mt-4">
        <div className="glass rounded-2xl px-5 py-3 flex items-center justify-between shadow-soft">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="size-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow-primary">
              <GraduationCap className="size-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">
            البوابة<span className="text-gradient-primary">التعليمية</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="/#academies" className="hover:text-foreground transition-colors">الأكاديميات</a>
            <a href="/#features" className="hover:text-foreground transition-colors">المميزات</a>
            <a href="/#how" className="hover:text-foreground transition-colors">كيف نعمل</a>
          </nav>

          <div className="flex items-center gap-2">
            {loading ? (
              <div className="size-8 rounded-lg bg-white/5 animate-pulse" />
            ) : user ? (
              <>
                <Link
                  to={dashboardPathForRole(role)}
                  className="text-sm px-3 py-2 rounded-lg glass hover:bg-white/10 transition inline-flex items-center gap-1.5"
                >
                  <LayoutDashboard className="size-4" />
                  لوحتي
                </Link>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="text-sm px-3 py-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition inline-flex items-center gap-1.5"
                  aria-label="تسجيل الخروج"
                >
                  <LogOut className="size-4" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm px-4 py-2 rounded-lg glass hover:bg-white/10 transition-colors inline-flex items-center gap-1.5"
              >
                <ShieldCheck className="size-4 text-primary" />
                دخول الإدارة
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
