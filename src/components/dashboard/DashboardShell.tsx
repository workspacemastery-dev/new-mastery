import { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { clearStudentSession, getStoredStudentToken } from "@/hooks/useStudentAuth";

export function DashboardShell({
  title,
  roleLabel,
  children,
}: {
  title: string;
  roleLabel: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-card/40 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow-primary">
              <GraduationCap className="size-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">
              Edu<span className="text-gradient-primary">Verse</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1.5 rounded-full glass text-muted-foreground">{roleLabel}</span>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg hover:bg-white/5 transition text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-4" />
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-3xl lg:text-4xl font-bold mb-8">{title}</h1>
        {children}
      </main>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent = "primary",
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "primary" | "math" | "physics" | "chemistry" | "gold";
}) {
  const map: Record<string, string> = {
    primary: "from-primary to-primary/40",
    math: "from-math to-math/40",
    physics: "from-physics to-physics/40",
    chemistry: "from-chemistry to-chemistry/40",
    gold: "from-gold to-gold/40",
  };
  return (
    <div className="relative bg-card-premium border border-border/60 rounded-2xl p-6 overflow-hidden">
      <div className={`absolute -top-12 -left-12 size-32 bg-gradient-to-br ${map[accent]} opacity-20 blur-2xl rounded-full`} />
      <div className="relative">
        <div className="text-sm text-muted-foreground mb-2">{label}</div>
        <div className="text-3xl font-bold">{value}</div>
        {hint && <div className="text-xs text-muted-foreground mt-2">{hint}</div>}
      </div>
    </div>
  );
}
