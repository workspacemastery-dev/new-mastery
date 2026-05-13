import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { u as useAuth } from "./useAuth-CuQlxuo9.js";
import { s as supabase } from "./router-BfT70NIy.js";
import { P as PageContainer, a as PageHeader } from "./DashboardLayout-CKTD8bPJ.js";
import { L as LoaderCircle } from "./loader-circle-B8rYq1WK.js";
import { U as Users } from "./users-BIEQI_yv.js";
import { S as Search } from "./search-DCkidx3Y.js";
import { C as Check } from "./check-VMC00cdB.js";
import { X } from "./x-yy412flO.js";
import { c as createLucideIcon } from "./createLucideIcon-DHqPreVB.js";
import { P as Power } from "./power-lzN5pKur.js";
import { T as Trash2, P as Plus } from "./trash-2-jUqHHfa-.js";
import { C as CircleAlert } from "./circle-alert-c7tAyljS.js";
import { C as CircleCheck } from "./circle-check-D9LZDFiz.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./useStudentAuth-Mzi_1DBf.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./log-out-ajI5jNrW.js";
const __iconNode$1 = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode);
function TeacherStudents() {
  const {
    user,
    role,
    loading: authLoading
  } = useAuth();
  const [academyId, setAcademyId] = reactExports.useState(null);
  const [academyName, setAcademyName] = reactExports.useState("");
  const [students, setStudents] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [name, setName] = reactExports.useState("");
  const [creating, setCreating] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [justCreated, setJustCreated] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState("");
  const [editId, setEditId] = reactExports.useState(null);
  const [editName, setEditName] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (!user || role !== "teacher") return;
    (async () => {
      const {
        data: aca
      } = await supabase.from("academies").select("id, name").eq("teacher_id", user.id).maybeSingle();
      if (!aca) {
        setLoading(false);
        return;
      }
      setAcademyId(aca.id);
      setAcademyName(aca.name);
      await refresh(aca.id);
      setLoading(false);
    })();
  }, [user, role]);
  async function refresh(id) {
    const {
      data
    } = await supabase.from("students").select("id, student_code, full_name, is_active, created_at").eq("academy_id", id).order("created_at", {
      ascending: false
    });
    setStudents(data ?? []);
  }
  async function onCreate(e) {
    e.preventDefault();
    if (!academyId) return;
    setError(null);
    setCreating(true);
    const {
      data,
      error: rpcErr
    } = await supabase.rpc("create_student", {
      _academy_id: academyId,
      _full_name: name.trim()
    });
    setCreating(false);
    if (rpcErr || !data) {
      setError(rpcErr?.message ?? "فشل إنشاء الطالب");
      return;
    }
    setJustCreated(data);
    setName("");
    refresh(academyId);
  }
  async function toggleActive(s) {
    await supabase.from("students").update({
      is_active: !s.is_active
    }).eq("id", s.id);
    if (academyId) refresh(academyId);
  }
  async function deleteStudent(id) {
    if (!confirm("هل أنت متأكد من حذف هذا الطالب؟")) return;
    await supabase.from("students").delete().eq("id", id);
    if (academyId) refresh(academyId);
  }
  async function saveEdit(id) {
    const name2 = editName.trim();
    if (!name2) return;
    await supabase.from("students").update({
      full_name: name2
    }).eq("id", id);
    setEditId(null);
    if (academyId) refresh(academyId);
  }
  function copy(text) {
    navigator.clipboard.writeText(text);
  }
  if (authLoading || loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PageContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin text-primary" }) }) });
  }
  if (!academyId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "إدارة الطلاب", description: "" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "لم يتم تعيينك لأكاديمية بعد." }) })
    ] });
  }
  const filtered = students.filter((s) => s.full_name.includes(search) || s.student_code.toLowerCase().includes(search.toLowerCase()));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: `طلاب ${academyName}`, description: "أنشئ Student IDs ووزّعها على طلابك" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[1fr_360px] gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-5 text-primary" }),
            "قائمة الطلاب (",
            students.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "بحث بالاسم أو ID", className: "pr-9 pl-3 py-2 text-sm rounded-lg bg-input border border-border focus:border-primary focus:outline-none" })
          ] })
        ] }),
        filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-sm text-muted-foreground py-12", children: students.length === 0 ? "لم تضف أي طالب بعد." : "لا توجد نتائج." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/60 text-muted-foreground text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-3 px-2", children: "الاسم" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-3 px-2", children: "Student ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-3 px-2", children: "الحالة" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-3 px-2", children: "إجراءات" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/30 hover:bg-white/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-2 font-medium", children: editId === s.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { autoFocus: true, value: editName, onChange: (e) => setEditName(e.target.value), onKeyDown: (e) => {
                if (e.key === "Enter") saveEdit(s.id);
                if (e.key === "Escape") setEditId(null);
              }, className: "px-2 py-1 text-sm rounded bg-input border border-border focus:border-primary focus:outline-none" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => saveEdit(s.id), className: "p-1 rounded hover:bg-green-500/20 text-green-400", title: "حفظ", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditId(null), className: "p-1 rounded hover:bg-white/10 text-muted-foreground", title: "إلغاء", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
            ] }) : s.full_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-primary/10 text-primary px-2 py-1 rounded font-mono text-xs", children: s.student_code }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-1 rounded-full ${s.is_active ? "bg-green-500/15 text-green-400" : "bg-muted text-muted-foreground"}`, children: s.is_active ? "نشط" : "متوقف" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 px-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => copy(s.student_code), className: "p-1.5 rounded hover:bg-white/10 text-muted-foreground", title: "نسخ ID", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                setEditId(s.id);
                setEditName(s.full_name);
              }, className: "p-1.5 rounded hover:bg-white/10 text-muted-foreground", title: "تعديل الاسم", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleActive(s), className: "p-1.5 rounded hover:bg-white/10 text-muted-foreground", title: "تفعيل/إيقاف", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "size-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => deleteStudent(s.id), className: "p-1.5 rounded hover:bg-destructive/20 text-destructive", title: "حذف", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
            ] }) })
          ] }, s.id)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: onCreate, className: "bg-card-premium border border-border/60 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold mb-4 inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 text-primary" }),
            "إضافة طالب جديد"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-sm font-medium mb-2", children: "اسم الطالب" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (e) => setName(e.target.value), required: true, minLength: 2, placeholder: "أحمد محمد", className: "w-full px-4 py-2.5 rounded-lg bg-input border border-border focus:border-primary focus:outline-none" })
          ] }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 mb-3 flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-4 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: error })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: creating, className: "w-full py-2.5 rounded-lg bg-gradient-primary text-primary-foreground font-semibold disabled:opacity-60", children: creating ? "جارٍ الإنشاء..." : "توليد Student ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-3 leading-relaxed", children: [
            "سيُولَّد Student ID تلقائياً بصيغة ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-foreground", children: "STU-XXXX" }),
            " وسيكون صالحاً فقط داخل أكاديميتك."
          ] })
        ] }),
        justCreated && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-green-500/10 border border-green-500/30 rounded-2xl p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3 text-green-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: "تم إنشاء الطالب" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "الاسم:" }),
              " ",
              justCreated.full_name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Student ID:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-card px-2 py-1 rounded font-mono", children: justCreated.student_code }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => copy(justCreated.student_code), className: "p-1 hover:text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "size-3.5" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-3", children: "سلّم هذه البيانات للطالب ليدخل من صفحة الأكاديمية." })
        ] })
      ] })
    ] })
  ] });
}
export {
  TeacherStudents as component
};
