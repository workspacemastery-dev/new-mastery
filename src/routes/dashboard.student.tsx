import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, LayoutDashboard, MessageCircle, BookOpen, ClipboardList, FileText} from "lucide-react";
import { useStudentAuth } from "@/hooks/useStudentAuth";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout, type NavItem } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/student")({
  head: () => ({ meta: [{ title: "لوحة الطالب — EduVerse" }] }),
  component: StudentLayoutRoute,
});

function StudentLayoutRoute() {
  const { session, loading } = useStudentAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!session) return;
    let active = true;
    async function load() {
      const { count } = await supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("academy_id", session!.academy_id)
        .eq("student_id", session!.student_id)
        .eq("sender_role", "teacher")
        .eq("is_read", false);
      if (active) setUnread(count ?? 0);
    }
    void load();
    const ch = supabase
      .channel(`stu-msgs-${session.student_id}`)
      .on("postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `student_id=eq.${session.student_id}` },
        () => void load())
      .subscribe();
    return () => { active = false; void supabase.removeChannel(ch); };
  }, [session]);

  if (loading) {
    return <div className="min-h-screen grid place-items-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  }
  if (!session) return <Navigate to="/" />;

  const studentNav: NavItem[] = [
    { to: "/dashboard/student", label: "الرئيسية", icon: LayoutDashboard, exact: true },
    { to: "/dashboard/student/courses", label: "الكورسات", icon: BookOpen },
    { to: "/dashboard/student/quizzes", label: "الاختبارات", icon: ClipboardList },
    { to: "/dashboard/student/articles", label: "المقالات", icon: FileText },
    { to: "/dashboard/student/messages", label: "المراسلة", icon: MessageCircle, badge: unread },
  ];

  return (
    <DashboardLayout
      roleLabel={`طالب · ${session.academy_name}`}
      navItems={studentNav}
      userName={`${session.full_name} (${session.student_code})`}
    >
      <Outlet />
    </DashboardLayout>
  );
}
