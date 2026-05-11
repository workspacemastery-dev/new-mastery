import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "super_admin" | "teacher" | "student";

export interface AuthState {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  loading: boolean;
}

/**
 * useAuth — listens to auth state and fetches the user's primary role from user_roles.
 * The role fetch is deferred (setTimeout 0) inside the auth listener to avoid
 * Supabase deadlocks (per Supabase docs).
 */
export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function fetchRole(userId: string) {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .order("role", { ascending: true });
      if (!active) return;
      // priority: super_admin > teacher > student
      const roles = (data ?? []).map((r) => r.role as AppRole);
      const primary: AppRole | null =
        roles.find((r) => r === "super_admin") ??
        roles.find((r) => r === "teacher") ??
        roles.find((r) => r === "student") ??
        null;
      setRole(primary);
    }

    // 1. Set listener FIRST
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        // defer role fetch to avoid deadlock
        setTimeout(() => {
          fetchRole(newSession.user.id);
        }, 0);
      } else {
        setRole(null);
      }
    });

    // 2. Then check for existing session
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        fetchRole(data.session.user.id).finally(() => {
          if (active) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, session, role, loading };
}

export function dashboardPathForRole(role: AppRole | null): string {
  switch (role) {
    case "super_admin":
      return "/dashboard/admin";
    case "teacher":
      return "/dashboard/teacher";
    case "student":
      return "/dashboard/student";
    default:
      return "/login";
  }
}
