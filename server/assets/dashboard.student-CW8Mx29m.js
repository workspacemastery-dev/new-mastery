import { r as reactExports, T as jsxRuntimeExports, Z as Outlet } from "./worker-entry-cdzVwTsG.js";
import { s as supabase, N as Navigate } from "./router-BfT70NIy.js";
import { u as useStudentAuth } from "./useStudentAuth-Mzi_1DBf.js";
import { D as DashboardLayout } from "./DashboardLayout-CKTD8bPJ.js";
import { L as LoaderCircle } from "./loader-circle-B8rYq1WK.js";
import { L as LayoutDashboard } from "./layout-dashboard-CTedgaC8.js";
import { B as BookOpen } from "./book-open-D70hEmbw.js";
import { C as ClipboardList } from "./clipboard-list-D_SvJuHr.js";
import { F as FileText } from "./file-text-DbtC_hJa.js";
import { M as MessageCircle } from "./message-circle-B6I0FyNw.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./createLucideIcon-DHqPreVB.js";
import "./log-out-ajI5jNrW.js";
import "./x-yy412flO.js";
function StudentLayoutRoute() {
  const {
    session,
    loading
  } = useStudentAuth();
  const [unread, setUnread] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (!session) return;
    let active = true;
    async function load() {
      const {
        count
      } = await supabase.from("messages").select("id", {
        count: "exact",
        head: true
      }).eq("academy_id", session.academy_id).eq("student_id", session.student_id).eq("sender_role", "teacher").eq("is_read", false);
      if (active) setUnread(count ?? 0);
    }
    void load();
    const ch = supabase.channel(`stu-msgs-${session.student_id}`).on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "messages",
      filter: `student_id=eq.${session.student_id}`
    }, () => void load()).subscribe();
    return () => {
      active = false;
      void supabase.removeChannel(ch);
    };
  }, [session]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin text-primary" }) });
  }
  if (!session) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/" });
  const studentNav = [{
    to: "/dashboard/student",
    label: "الرئيسية",
    icon: LayoutDashboard,
    exact: true
  }, {
    to: "/dashboard/student/courses",
    label: "الكورسات",
    icon: BookOpen
  }, {
    to: "/dashboard/student/quizzes",
    label: "الاختبارات",
    icon: ClipboardList
  }, {
    to: "/dashboard/student/articles",
    label: "المقالات",
    icon: FileText
  }, {
    to: "/dashboard/student/messages",
    label: "المراسلة",
    icon: MessageCircle,
    badge: unread
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { roleLabel: `طالب · ${session.academy_name}`, navItems: studentNav, userName: `${session.full_name} (${session.student_code})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) });
}
export {
  StudentLayoutRoute as component
};
