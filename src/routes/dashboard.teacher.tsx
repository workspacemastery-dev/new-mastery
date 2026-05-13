import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, LayoutDashboard, BookOpen, ClipboardList, Users, UserCircle, MessageCircle, BrainCircuit , FileText , Megaphone,Trophy } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout, type NavItem } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/teacher")({
  head: () => ({ meta: [{ title: "لوحة المعلم — EduVerse" }] }),
  component: TeacherLayoutRoute,
});

function TeacherLayoutRoute() {
  const { user, role, loading } = useAuth();
  const [academyName, setAcademyName] = useState<string>("");
  const [academyId, setAcademyId] = useState<string | null>(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user || role !== "teacher") return;
    void (async () => {
      const { data } = await supabase
        .from("academies")
        .select("id, name")
        .eq("teacher_id", user.id)
        .maybeSingle();
      if (data) { setAcademyName(data.name); setAcademyId(data.id); }
    })();
  }, [user, role]);

  useEffect(() => {
    if (!academyId) return;
    let active = true;
    async function load() {
      const { count } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("academy_id", academyId!)
        .eq("sender_role", "student")
        .eq("is_read", false);
      if (active) setUnread(count ?? 0);
    }
    void load();
    const ch = supabase
      .channel(`teacher-unread-${academyId}`)
      .on("postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `academy_id=eq.${academyId}` },
        () => void load())
      .subscribe();
    return () => { active = false; void supabase.removeChannel(ch); };
  }, [academyId]);

  const teacherNav: NavItem[] = [
    { to: "/dashboard/teacher", label: "الرئيسية", icon: LayoutDashboard, exact: true },
    { to: "/dashboard/teacher/results", label: "النتائج", icon: Trophy },
    { to: "/dashboard/teacher/courses", label: "الكورسات", icon: BookOpen },
    { to: "/dashboard/teacher/quizzes", label: "الاختبارات", icon: ClipboardList },
    { to: "/dashboard/teacher/question-bank", label: "بنك الأسئلة", icon: BrainCircuit },
    { to: "/dashboard/teacher/students", label: "الطلاب", icon: Users },
    { to: "/dashboard/teacher/articles", label: "المقالات", icon: FileText },
    { to: "/dashboard/teacher/announcements", label: "الإعلانات", icon: Megaphone },
    { to: "/dashboard/teacher/messages", label: "المراسلة", icon: MessageCircle, badge: unread },
    { to: "/dashboard/teacher/profile", label: "الملف الشخصي", icon: UserCircle },
  ];

  if (loading) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  }
  if (!user) return <Navigate to="/login" />;
  if (role !== "teacher") return <Navigate to="/dashboard" />;

  return (
    <DashboardLayout
      roleLabel={academyName ? `معلم · ${academyName}` : "معلم"}
      navItems={teacherNav}
      userName={user.email ?? undefined}
    >
      <Outlet />
    </DashboardLayout>
  );
}
