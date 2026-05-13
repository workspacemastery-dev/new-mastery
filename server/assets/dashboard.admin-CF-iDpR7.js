import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { N as Navigate, s as supabase } from "./router-BfT70NIy.js";
import { u as useAuth } from "./useAuth-CuQlxuo9.js";
import { D as DashboardShell, S as StatCard } from "./DashboardShell-C8RF7EdW.js";
import { I as ImageUploadField } from "./ImageUploadField-B6wfmL7r.js";
import { s as setTeacherDisabled, d as deleteTeacherAccount, b as createTeacherAccount, r as resetUserPassword, u as updateTeacherAccount } from "./admin-users-Dj0DvsD_.js";
import { L as LoaderCircle } from "./loader-circle-B8rYq1WK.js";
import { L as Layers } from "./layers-DeLHyVMc.js";
import { P as Plus, T as Trash2 } from "./trash-2-jUqHHfa-.js";
import { P as Pen } from "./pen-CLgFSF3R.js";
import { P as Power } from "./power-lzN5pKur.js";
import { U as Users } from "./users-BIEQI_yv.js";
import { C as CircleAlert } from "./circle-alert-c7tAyljS.js";
import { M as Mail } from "./mail-Btv11zbm.js";
import { C as CircleCheck } from "./circle-check-D9LZDFiz.js";
import { X } from "./x-yy412flO.js";
import { B as BookOpen } from "./book-open-D70hEmbw.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./useStudentAuth-Mzi_1DBf.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./createLucideIcon-DHqPreVB.js";
import "./log-out-ajI5jNrW.js";
import "./image-DntQ77e3.js";
async function getAccessToken() {
  const {
    data
  } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("انتهت الجلسة، سجّل الدخول مرة أخرى");
  return token;
}
function AdminDashboard() {
  const {
    user,
    role,
    loading
  } = useAuth();
  const [tab, setTab] = reactExports.useState("overview");
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin text-primary" }) });
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" });
  if (role !== "super_admin") return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/dashboard" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DashboardShell, { title: "لوحة الأدمن العام", roleLabel: "Super Admin", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-8 overflow-x-auto bg-card border border-border/60 rounded-xl p-1 w-fit", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabBtn, { active: tab === "overview", onClick: () => setTab("overview"), children: "نظرة عامة" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabBtn, { active: tab === "academies", onClick: () => setTab("academies"), children: "الأكاديميات" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabBtn, { active: tab === "teachers", onClick: () => setTab("teachers"), children: "المعلمون" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabBtn, { active: tab === "moderation", onClick: () => setTab("moderation"), children: "مراجعة المحتوى" })
    ] }),
    tab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewTab, {}),
    tab === "academies" && /* @__PURE__ */ jsxRuntimeExports.jsx(AcademiesTab, {}),
    tab === "teachers" && /* @__PURE__ */ jsxRuntimeExports.jsx(TeachersTab, {}),
    tab === "moderation" && /* @__PURE__ */ jsxRuntimeExports.jsx(ModerationTab, {})
  ] });
}
function TabBtn({
  active,
  onClick,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, className: `px-4 py-2 text-sm font-medium rounded-lg transition whitespace-nowrap ${active ? "bg-gradient-primary text-primary-foreground shadow-glow-primary" : "text-muted-foreground hover:text-foreground"}`, children });
}
function OverviewTab() {
  const [counts, setCounts] = reactExports.useState({
    academies: 0,
    teachers: 0,
    students: 0,
    courses: 0
  });
  reactExports.useEffect(() => {
    (async () => {
      const [a, t, s, c] = await Promise.all([supabase.from("academies").select("*", {
        count: "exact",
        head: true
      }), supabase.from("user_roles").select("*", {
        count: "exact",
        head: true
      }).eq("role", "teacher"), supabase.from("students").select("*", {
        count: "exact",
        head: true
      }), supabase.from("courses").select("*", {
        count: "exact",
        head: true
      })]);
      setCounts({
        academies: a.count ?? 0,
        teachers: t.count ?? 0,
        students: s.count ?? 0,
        courses: c.count ?? 0
      });
    })();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "الأكاديميات", value: counts.academies, accent: "primary" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "المعلمون", value: counts.teachers, accent: "math" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "الطلاب", value: counts.students, accent: "physics" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "الكورسات", value: counts.courses, accent: "chemistry" })
  ] });
}
function AcademiesTab() {
  const [list, setList] = reactExports.useState([]);
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(null);
  async function refresh() {
    const {
      data
    } = await supabase.from("academies").select("*").order("created_at");
    setList(data ?? []);
  }
  reactExports.useEffect(() => {
    refresh();
  }, []);
  async function togglePublish(a) {
    await supabase.from("academies").update({
      is_published: !a.is_published
    }).eq("id", a.id);
    refresh();
  }
  async function remove(id) {
    if (!confirm("حذف الأكاديمية وكل محتواها؟")) return;
    await supabase.from("academies").delete().eq("id", id);
    refresh();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold inline-flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "size-5 text-primary" }),
        " الأكاديميات (",
        list.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
        setEditing(null);
        setShowForm(true);
      }, className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-glow-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " أكاديمية جديدة"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4", children: list.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold mb-0.5", children: a.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            a.subject,
            " · /",
            a.slug
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-1 rounded-full ${a.is_published ? "bg-green-500/15 text-green-400" : "bg-muted text-muted-foreground"}`, children: a.is_published ? "منشورة" : "مسودة" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-3", children: [
        "معلم: ",
        a.teacher_name ?? "غير معيّن"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
          setEditing(a);
          setShowForm(true);
        }, className: "flex-1 text-xs py-1.5 rounded-lg glass hover:bg-white/10 inline-flex items-center justify-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "size-3" }),
          " تعديل"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => togglePublish(a), className: "text-xs px-2 py-1.5 rounded-lg glass hover:bg-white/10", title: "نشر/إلغاء", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "size-3.5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(a.id), className: "text-xs px-2 py-1.5 rounded-lg hover:bg-destructive/20 text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) })
      ] })
    ] }, a.id)) }),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(AcademyForm, { onClose: () => {
      setShowForm(false);
      refresh();
    }, editing })
  ] });
}
function AcademyForm({
  onClose,
  editing
}) {
  const [name, setName] = reactExports.useState(editing?.name ?? "");
  const [subject, setSubject] = reactExports.useState(editing?.subject ?? "");
  const [slug, setSlug] = reactExports.useState(editing?.slug ?? "");
  const [description, setDescription] = reactExports.useState(editing?.description ?? "");
  const [teacherName, setTeacherName] = reactExports.useState(editing?.teacher_name ?? "");
  const [imageUrl, setImageUrl] = reactExports.useState(editing?.image_url ?? null);
  const [coverImageUrl, setCoverImageUrl] = reactExports.useState(editing?.cover_image_url ?? null);
  const [accent, setAccent] = reactExports.useState(editing?.accent_color ?? "oklch(0.6 0.2 250)");
  const [error, setError] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  function normalizeSlug(s) {
    return s.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\p{L}\p{N}\-_]/gu, "").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  }
  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const cleanSlug = normalizeSlug(slug);
    if (!cleanSlug) {
      setError("Slug غير صالح");
      setSaving(false);
      return;
    }
    const payload = {
      name,
      subject,
      slug: cleanSlug,
      description,
      teacher_name: teacherName || null,
      image_url: imageUrl,
      cover_image_url: coverImageUrl,
      accent_color: accent
    };
    const {
      error: err
    } = editing ? await supabase.from("academies").update(payload).eq("id", editing.id) : await supabase.from("academies").insert(payload);
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-background/80 backdrop-blur grid place-items-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold", children: editing ? "تعديل الأكاديمية" : "أكاديمية جديدة" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1 hover:bg-white/10 rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "اسم الأكاديمية", value: name, onChange: setName, required: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "المادة", value: subject, onChange: setSubject, required: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Portal Slug", value: slug, onChange: setSlug, required: true, placeholder: "physics" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "اسم المعلم (اختياري)", value: teacherName, onChange: setTeacherName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "لون التمييز (CSS)", value: accent, onChange: setAccent })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ImageUploadField, { label: "صورة الكارت في الصفحة الرئيسية", value: imageUrl, onChange: setImageUrl, folder: "academies/cards", hint: "تظهر في كارت الأكاديمية على الصفحة الرئيسية. مقترح 768×768." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ImageUploadField, { label: "صورة الغلاف (صفحة الأكاديمية قبل تسجيل الدخول)", value: coverImageUrl, onChange: setCoverImageUrl, folder: "academies/covers", hint: "تظهر في صفحة الأكاديمية الرئيسية وصفحة تسجيل الدخول." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-sm font-medium mb-2", children: "الوصف" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), rows: 3, className: "w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none" })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-4 shrink-0" }),
        error
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 rounded-lg glass", children: "إلغاء" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: saving, className: "px-5 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-semibold", children: saving ? "..." : "حفظ" })
      ] })
    ] })
  ] }) });
}
function Field({
  label,
  value,
  onChange,
  placeholder,
  required
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-sm font-medium mb-2", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value, onChange: (e) => onChange(e.target.value), placeholder, required, className: "w-full px-4 py-2.5 rounded-lg bg-input border border-border focus:border-primary focus:outline-none" })
  ] });
}
function TeachersTab() {
  const [teachers, setTeachers] = reactExports.useState([]);
  const [academies, setAcademies] = reactExports.useState([]);
  const [showForm, setShowForm] = reactExports.useState(false);
  const [created, setCreated] = reactExports.useState(null);
  const [resetting, setResetting] = reactExports.useState(null);
  const [editing, setEditing] = reactExports.useState(null);
  const [viewing, setViewing] = reactExports.useState(null);
  const [actionError, setActionError] = reactExports.useState(null);
  async function refresh() {
    const [{
      data: list
    }, {
      data: acas
    }] = await Promise.all([
      // typed via Database after generation; cast for compile until types regen
      supabase.rpc("admin_list_teachers"),
      supabase.from("academies").select("*")
    ]);
    setAcademies(acas ?? []);
    setTeachers(list ?? []);
  }
  reactExports.useEffect(() => {
    refresh();
  }, []);
  async function toggleTeacher(t) {
    setActionError(null);
    try {
      await setTeacherDisabled({
        data: {
          accessToken: await getAccessToken(),
          userId: t.user_id,
          disabled: t.status === "active"
        }
      });
      refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "تعذّر تحديث الحالة");
    }
  }
  async function removeTeacher(t) {
    if (!confirm("حذف حساب المعلم نهائيًا؟")) return;
    setActionError(null);
    try {
      await deleteTeacherAccount({
        data: {
          accessToken: await getAccessToken(),
          userId: t.user_id
        }
      });
      refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "تعذّر حذف المعلم");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold inline-flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-5 text-primary" }),
        " المعلمون (",
        teachers.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowForm(true), className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-glow-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " إنشاء معلم"
      ] })
    ] }),
    actionError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-4 shrink-0" }),
      actionError
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-6 overflow-x-auto", children: teachers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-sm text-muted-foreground py-12", children: "لا يوجد معلمون بعد." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full min-w-[860px] text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/60 text-muted-foreground text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-3", children: "الاسم" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-3", children: "Teacher ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-3", children: "البريد" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-3", children: "الأكاديمية" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-3", children: "الحالة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-3", children: "تاريخ الإنشاء" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-3", children: "إجراءات" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: teachers.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 font-medium", children: t.full_name || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 text-muted-foreground font-mono text-xs", children: t.user_id.slice(0, 8) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "py-3 text-muted-foreground inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-3.5" }),
          t.email
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 text-muted-foreground", children: t.academy_name ?? "غير مرتبط" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-1 rounded-full ${t.status === "active" ? "bg-chemistry/15 text-chemistry" : "bg-muted text-muted-foreground"}`, children: t.status === "active" ? "نشط" : "معطل" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 text-muted-foreground", children: new Date(t.created_at).toLocaleDateString("ar") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setViewing(t), className: "text-xs px-2 py-1 rounded glass hover:bg-white/10", children: "عرض" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditing(t), className: "text-xs px-2 py-1 rounded glass hover:bg-white/10", children: "تعديل" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleTeacher(t), className: "text-xs px-2 py-1 rounded glass hover:bg-white/10", children: t.status === "active" ? "تعطيل" : "تفعيل" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setResetting(t), className: "text-xs px-2 py-1 rounded glass hover:bg-white/10", title: "إعادة تعيين كلمة المرور", children: "إعادة تعيين" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeTeacher(t), className: "text-xs px-2 py-1 rounded hover:bg-destructive/20 text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) })
        ] }) })
      ] }, t.user_id)) })
    ] }) }),
    showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(CreateTeacherForm, { academies, onClose: (c) => {
      setShowForm(false);
      if (c) setCreated(c);
      refresh();
    } }),
    resetting && /* @__PURE__ */ jsxRuntimeExports.jsx(ResetPasswordForm, { teacher: resetting, onClose: () => setResetting(null) }),
    editing && /* @__PURE__ */ jsxRuntimeExports.jsx(EditTeacherForm, { teacher: editing, academies, onClose: () => {
      setEditing(null);
      refresh();
    } }),
    viewing && /* @__PURE__ */ jsxRuntimeExports.jsx(TeacherDetails, { teacher: viewing, onClose: () => setViewing(null) }),
    created && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed bottom-6 left-6 bg-green-500/15 border border-green-500/40 rounded-xl p-4 max-w-sm shadow-elevated z-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2 text-green-400 font-bold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4" }),
        " تم إنشاء حساب المعلم"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "البريد:" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-card px-1.5 py-0.5 rounded", children: created.email })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "كلمة المرور:" }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-card px-1.5 py-0.5 rounded", children: created.password })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "سلّم هذه البيانات للمعلم." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setCreated(null), className: "absolute top-2 left-2 p-1 hover:bg-white/10 rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3" }) })
    ] })
  ] });
}
function ResetPasswordForm({
  teacher,
  onClose
}) {
  const [password, setPassword] = reactExports.useState("");
  const [error, setError] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const [done, setDone] = reactExports.useState(false);
  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await resetUserPassword({
        data: {
          accessToken: await getAccessToken(),
          email: teacher.email,
          newPassword: password
        }
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-background/80 backdrop-blur grid place-items-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-6 w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold", children: "إعادة تعيين كلمة المرور" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1 hover:bg-white/10 rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" }) })
    ] }),
    done ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm bg-green-500/15 border border-green-500/40 rounded-lg p-3 text-green-400 inline-flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 shrink-0" }),
        "تم تحديث كلمة المرور بنجاح. سلّمها للمعلم."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "البريد: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-input px-1.5 py-0.5 rounded", children: teacher.email })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "كلمة المرور الجديدة: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-input px-1.5 py-0.5 rounded", children: password })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "w-full py-2 rounded-lg bg-gradient-primary text-primary-foreground font-semibold", children: "تم" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "للحساب: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-input px-1.5 py-0.5 rounded", children: teacher.email })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-sm font-medium mb-2", children: "كلمة المرور الجديدة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: password, onChange: (e) => setPassword(e.target.value), required: true, minLength: 6, className: "w-full px-4 py-2.5 rounded-lg bg-input border border-border focus:border-primary focus:outline-none font-mono" })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-4 shrink-0" }),
        error
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: saving, className: "w-full py-2.5 rounded-lg bg-gradient-primary text-primary-foreground font-semibold", children: saving ? "..." : "تحديث كلمة المرور" })
    ] })
  ] }) });
}
function TeacherDetails({
  teacher,
  onClose
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-background/80 backdrop-blur grid place-items-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-6 w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold", children: "بيانات المعلم" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1 hover:bg-white/10 rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Teacher ID", value: teacher.user_id, mono: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "الاسم", value: teacher.full_name || "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "البريد", value: teacher.email }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "الأكاديمية", value: teacher.academy_name ?? "غير مرتبط" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "الحالة", value: teacher.status === "active" ? "نشط" : "معطل" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "تاريخ الإنشاء", value: new Date(teacher.created_at).toLocaleString("ar") })
    ] })
  ] }) });
}
function Info({
  label,
  value,
  mono
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-input px-3 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: mono ? "font-mono text-xs break-all" : "font-medium", children: value })
  ] });
}
function EditTeacherForm({
  teacher,
  academies,
  onClose
}) {
  const [fullName, setFullName] = reactExports.useState(teacher.full_name ?? "");
  const [academyId, setAcademyId] = reactExports.useState(teacher.academy_id ?? academies[0]?.id ?? "");
  const [error, setError] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await updateTeacherAccount({
        data: {
          accessToken: await getAccessToken(),
          userId: teacher.user_id,
          fullName,
          academyId
        }
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر تحديث المعلم");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-background/80 backdrop-blur grid place-items-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-6 w-full max-w-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold", children: "تعديل بيانات المعلم" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-1 hover:bg-white/10 rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "الاسم الكامل", value: fullName, onChange: setFullName, required: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-sm font-medium mb-2", children: "الأكاديمية" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: academyId, onChange: (e) => setAcademyId(e.target.value), required: true, className: "w-full px-4 py-2.5 rounded-lg bg-input border border-border focus:border-primary focus:outline-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "اختر أكاديمية" }),
          academies.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: a.id, children: a.name }, a.id))
        ] })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-4 shrink-0" }),
        error
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 rounded-lg glass", children: "إلغاء" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: saving, className: "px-5 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-semibold", children: saving ? "..." : "حفظ" })
      ] })
    ] })
  ] }) });
}
function CreateTeacherForm({
  academies,
  onClose
}) {
  const [fullName, setFullName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [academyId, setAcademyId] = reactExports.useState(academies[0]?.id ?? "");
  const [error, setError] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await createTeacherAccount({
        data: {
          accessToken: await getAccessToken(),
          fullName,
          email,
          password,
          academyId
        }
      });
      setSaving(false);
      onClose({
        email,
        password
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر الإنشاء");
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-background/80 backdrop-blur grid place-items-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl p-6 w-full max-w-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold", children: "إنشاء حساب معلم" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onClose(), className: "p-1 hover:bg-white/10 rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "الاسم الكامل", value: fullName, onChange: setFullName, required: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "البريد الإلكتروني", value: email, onChange: setEmail, required: true }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-sm font-medium mb-2", children: "كلمة المرور (احفظها لتسليمها للمعلم)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", value: password, onChange: (e) => setPassword(e.target.value), required: true, minLength: 6, className: "w-full px-4 py-2.5 rounded-lg bg-input border border-border focus:border-primary focus:outline-none font-mono" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-sm font-medium mb-2", children: "الأكاديمية" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: academyId, onChange: (e) => setAcademyId(e.target.value), required: true, className: "w-full px-4 py-2.5 rounded-lg bg-input border border-border focus:border-primary focus:outline-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "اختر أكاديمية" }),
          academies.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: a.id, children: a.name }, a.id))
        ] })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-4 shrink-0" }),
        error
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => onClose(), className: "px-4 py-2 rounded-lg glass", children: "إلغاء" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: saving, className: "px-5 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-semibold", children: saving ? "..." : "إنشاء" })
      ] })
    ] })
  ] }) });
}
function ModerationTab() {
  const [items, setItems] = reactExports.useState([]);
  async function refresh() {
    const [{
      data: courses
    }, {
      data: quizzes
    }, {
      data: acas
    }] = await Promise.all([supabase.from("courses").select("id, title, is_published, academy_id"), supabase.from("quizzes").select("id, title, is_published, academy_id"), supabase.from("academies").select("id, name")]);
    const acaMap = new Map((acas ?? []).map((a) => [a.id, a.name]));
    const merged = [...(courses ?? []).map((c) => ({
      ...c,
      type: "course",
      academy_name: acaMap.get(c.academy_id)
    })), ...(quizzes ?? []).map((q) => ({
      ...q,
      type: "quiz",
      academy_name: acaMap.get(q.academy_id)
    }))];
    setItems(merged);
  }
  reactExports.useEffect(() => {
    refresh();
  }, []);
  async function togglePublish(it) {
    await supabase.from(it.type === "course" ? "courses" : "quizzes").update({
      is_published: !it.is_published
    }).eq("id", it.id);
    refresh();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold mb-5 inline-flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-5 text-primary" }),
      " مراجعة المحتوى"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-6", children: items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-sm text-muted-foreground py-12", children: "لا يوجد محتوى للمراجعة." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/60 text-muted-foreground text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-3", children: "العنوان" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-3", children: "النوع" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-3", children: "الأكاديمية" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-3", children: "الحالة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right py-3", children: "إجراء" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 font-medium", children: it.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 text-muted-foreground", children: it.type === "course" ? "كورس" : "اختبار" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3 text-muted-foreground", children: it.academy_name ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs px-2 py-1 rounded-full ${it.is_published ? "bg-green-500/15 text-green-400" : "bg-muted text-muted-foreground"}`, children: it.is_published ? "منشور" : "مسودة" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => togglePublish(it), className: "text-xs px-3 py-1.5 rounded-lg glass hover:bg-white/10", children: it.is_published ? "إلغاء النشر" : "نشر" }) })
      ] }, `${it.type}-${it.id}`)) })
    ] }) })
  ] });
}
export {
  AdminDashboard as component
};
