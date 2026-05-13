import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { u as useAuth } from "./useAuth-CuQlxuo9.js";
import { s as supabase } from "./router-BfT70NIy.js";
import { P as PageContainer, a as PageHeader } from "./DashboardLayout-CKTD8bPJ.js";
import { M as MessageCircle } from "./message-circle-B6I0FyNw.js";
import { A as ArrowRight } from "./arrow-right-tchmZAQM.js";
import { L as LoaderCircle } from "./loader-circle-B8rYq1WK.js";
import { S as Send } from "./send-CcIDUjiL.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./useStudentAuth-Mzi_1DBf.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./createLucideIcon-DHqPreVB.js";
import "./log-out-ajI5jNrW.js";
import "./x-yy412flO.js";
function TeacherMessagesPage() {
  const {
    user,
    role
  } = useAuth();
  const [academyId, setAcademyId] = reactExports.useState(null);
  const [threads, setThreads] = reactExports.useState([]);
  const [active, setActive] = reactExports.useState(null);
  const [messages, setMessages] = reactExports.useState([]);
  const [body, setBody] = reactExports.useState("");
  const [sending, setSending] = reactExports.useState(false);
  const endRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!user || role !== "teacher") return;
    void (async () => {
      const {
        data: aca
      } = await supabase.from("academies").select("id").eq("teacher_id", user.id).maybeSingle();
      if (!aca) return;
      setAcademyId(aca.id);
    })();
  }, [user, role]);
  async function loadThreads(aId) {
    const {
      data
    } = await supabase.rpc("teacher_list_threads", {
      _academy_id: aId
    });
    setThreads(data ?? []);
  }
  async function loadMessages(studentId) {
    if (!academyId) return;
    const {
      data
    } = await supabase.from("messages").select("id, body, sender_role, created_at, is_read").eq("academy_id", academyId).eq("student_id", studentId).order("created_at", {
      ascending: true
    });
    setMessages(data ?? []);
    await supabase.from("messages").update({
      is_read: true
    }).eq("academy_id", academyId).eq("student_id", studentId).eq("sender_role", "student").eq("is_read", false);
  }
  reactExports.useEffect(() => {
    if (!academyId) return;
    void loadThreads(academyId);
    const ch = supabase.channel(`teacher-msgs-${academyId}`).on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "messages",
      filter: `academy_id=eq.${academyId}`
    }, () => {
      void loadThreads(academyId);
      if (active) void loadMessages(active.student_id);
    }).subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [academyId, active?.student_id]);
  reactExports.useEffect(() => {
    if (active) void loadMessages(active.student_id);
  }, [active?.student_id]);
  reactExports.useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages.length]);
  async function send(e) {
    e.preventDefault();
    if (!active || !academyId || !body.trim()) return;
    setSending(true);
    await supabase.from("messages").insert({
      academy_id: academyId,
      student_id: active.student_id,
      sender_role: "teacher",
      body: body.trim()
    });
    setBody("");
    setSending(false);
    await loadMessages(active.student_id);
    await loadThreads(academyId);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "المراسلة", description: "تواصل مع طلاب الأكاديمية" }),
    !academyId ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "يجب تعيينك لأكاديمية." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[320px_1fr] gap-4 h-[70vh]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `bg-card-premium border border-border/60 rounded-2xl overflow-y-auto ${active ? "hidden lg:block" : ""}`, children: threads.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-center text-sm text-muted-foreground", children: "لا يوجد طلاب بعد" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-border", children: threads.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActive(t), className: `w-full text-right p-3 hover:bg-accent/50 transition ${active?.student_id === t.student_id ? "bg-accent/40" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm", children: t.full_name }),
          t.unread_count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-primary text-primary-foreground text-[10px] rounded-full size-5 grid place-items-center", children: t.unread_count })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: t.last_body ?? "ابدأ المحادثة" })
      ] }) }, t.student_id)) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `bg-card-premium border border-border/60 rounded-2xl flex flex-col ${!active ? "hidden lg:flex" : "flex"}`, children: !active ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 grid place-items-center text-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-12 mx-auto mb-2 opacity-40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "اختر طالباً لبدء المحادثة" })
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border p-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setActive(null), className: "lg:hidden size-8 grid place-items-center rounded-lg hover:bg-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm", children: active.full_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: active.student_code })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-5 space-y-3", children: [
          messages.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${m.sender_role === "teacher" ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${m.sender_role === "teacher" ? "bg-primary text-primary-foreground" : "bg-accent"}`, children: [
            m.body,
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] opacity-70 mt-1", children: new Date(m.created_at).toLocaleString("ar-EG") })
          ] }) }, m.id)),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: endRef })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: send, className: "border-t border-border p-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: body, onChange: (e) => setBody(e.target.value), placeholder: "اكتب رسالتك...", className: "flex-1 bg-input border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: sending || !body.trim(), className: "size-10 grid place-items-center rounded-lg bg-gradient-primary text-primary-foreground disabled:opacity-50", children: sending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4" }) })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  TeacherMessagesPage as component
};
