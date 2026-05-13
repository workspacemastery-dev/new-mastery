import { r as reactExports } from "./worker-entry-cdzVwTsG.js";
import { s as supabase } from "./router-BfT70NIy.js";
function useAuth() {
  const [user, setUser] = reactExports.useState(null);
  const [session, setSession] = reactExports.useState(null);
  const [role, setRole] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    let active = true;
    async function fetchRole(userId) {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).order("role", { ascending: true });
      if (!active) return;
      const roles = (data ?? []).map((r) => r.role);
      const primary = roles.find((r) => r === "super_admin") ?? roles.find((r) => r === "teacher") ?? roles.find((r) => r === "student") ?? null;
      setRole(primary);
    }
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        setTimeout(() => {
          fetchRole(newSession.user.id);
        }, 0);
      } else {
        setRole(null);
      }
    });
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
function dashboardPathForRole(role) {
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
export {
  dashboardPathForRole as d,
  useAuth as u
};
