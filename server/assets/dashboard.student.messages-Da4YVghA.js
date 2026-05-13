import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { u as useStudentAuth } from "./useStudentAuth-Mzi_1DBf.js";
import { s as supabase } from "./router-BfT70NIy.js";
import { P as PageContainer, a as PageHeader } from "./DashboardLayout-CKTD8bPJ.js";
import { L as LoaderCircle } from "./loader-circle-B8rYq1WK.js";
import { M as MessageCircle } from "./message-circle-B6I0FyNw.js";
import { S as Send } from "./send-CcIDUjiL.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./createLucideIcon-DHqPreVB.js";
import "./log-out-ajI5jNrW.js";
import "./x-yy412flO.js";
function StudentMessagesPage() {
  const {
    session
  } = useStudentAuth();
  const [messages, setMessages] = reactExports.useState([]);
  const [body, setBody] = reactExports.useState("");
  const [sending, setSending] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(true);
  const endRef = reactExports.useRef(null);
  async function load() {
    if (!session) return;
    const {
      data
    } = await supabase.rpc("student_list_messages", {
      _token: session.token
    });
    setMessages(data ?? []);
    setLoading(false);
    await supabase.rpc("student_mark_read", {
      _token: session.token
    });
  }
  reactExports.useEffect(() => {
    if (!session) return;
    void load();
    const ch = supabase.channel(`msgs-${session.student_id}`).on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "messages",
      filter: `student_id=eq.${session.student_id}`
    }, () => void load()).subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [session?.student_id]);
  reactExports.useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages.length]);
  async function send(e) {
    e.preventDefault();
    if (!session || !body.trim()) return;
    setSending(true);
    await supabase.rpc("student_send_message", {
      _token: session.token,
      _body: body.trim()
    });
    setBody("");
    setSending(false);
    await load();
  }
  if (!session) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "المراسلة مع المعلم", description: "تواصل مباشر مع معلم الأكاديمية" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl flex flex-col h-[70vh]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-5 space-y-3", children: [
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full grid place-items-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-6 animate-spin" }) }) : messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full grid place-items-center text-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-12 mx-auto mb-2 opacity-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "لا توجد رسائل بعد. ابدأ المحادثة مع معلمك." })
        ] }) }) : messages.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${m.sender_role === "student" ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${m.sender_role === "student" ? "bg-primary text-primary-foreground" : "bg-accent"}`, children: [
          m.body,
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] opacity-70 mt-1", children: new Date(m.created_at).toLocaleString("ar-EG") })
        ] }) }, m.id)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: endRef })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: send, className: "border-t border-border p-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: body, onChange: (e) => setBody(e.target.value), placeholder: "اكتب رسالتك...", className: "flex-1 bg-input border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: sending || !body.trim(), className: "size-10 grid place-items-center rounded-lg bg-gradient-primary text-primary-foreground disabled:opacity-50", children: sending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4" }) })
      ] })
    ] })
  ] });
}
export {
  StudentMessagesPage as component
};
