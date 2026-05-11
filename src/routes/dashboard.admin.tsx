import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  Loader2, Users, GraduationCap, Layers, Plus, Trash2, Edit2,
  AlertCircle, CheckCircle2, X, Mail, BookOpen, Power,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell, StatCard } from "@/components/dashboard/DashboardShell";
import { ImageUploadField } from "@/components/dashboard/ImageUploadField";
import {
  createTeacherAccount,
  deleteTeacherAccount,
  resetUserPassword,
  setTeacherDisabled,
  updateTeacherAccount,
} from "@/server-functions/admin-users";

export const Route = createFileRoute("/dashboard/admin")({
  head: () => ({ meta: [{ title: "لوحة الأدمن العام — EduVerse" }] }),
  component: AdminDashboard,
});

interface Academy {
  id: string;
  name: string;
  subject: string;
  slug: string;
  teacher_name: string | null;
  teacher_id: string | null;
  is_published: boolean;
  description: string;
  image_url: string | null;
  cover_image_url: string | null;
  accent_color: string;
}

interface TeacherRow {
  user_id: string;
  academy_id: string | null;
  email: string;
  full_name: string;
  academy_name?: string;
  status: "active" | "disabled";
  created_at: string;
}

async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("انتهت الجلسة، سجّل الدخول مرة أخرى");
  return token;
}

type Tab = "overview" | "academies" | "teachers" | "moderation";

function AdminDashboard() {
  const { user, role, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");

  if (loading) return <div className="min-h-screen grid place-items-center"><Loader2 className="size-8 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (role !== "super_admin") return <Navigate to="/dashboard" />;

  return (
    <DashboardShell title="لوحة الأدمن العام" roleLabel="Super Admin">
      <div className="flex gap-2 mb-8 overflow-x-auto bg-card border border-border/60 rounded-xl p-1 w-fit">
        <TabBtn active={tab === "overview"} onClick={() => setTab("overview")}>نظرة عامة</TabBtn>
        <TabBtn active={tab === "academies"} onClick={() => setTab("academies")}>الأكاديميات</TabBtn>
        <TabBtn active={tab === "teachers"} onClick={() => setTab("teachers")}>المعلمون</TabBtn>
        <TabBtn active={tab === "moderation"} onClick={() => setTab("moderation")}>مراجعة المحتوى</TabBtn>
      </div>

      {tab === "overview" && <OverviewTab />}
      {tab === "academies" && <AcademiesTab />}
      {tab === "teachers" && <TeachersTab />}
      {tab === "moderation" && <ModerationTab />}
    </DashboardShell>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition whitespace-nowrap ${
        active ? "bg-gradient-primary text-primary-foreground shadow-glow-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function OverviewTab() {
  const [counts, setCounts] = useState({ academies: 0, teachers: 0, students: 0, courses: 0 });

  useEffect(() => {
    (async () => {
      const [a, t, s, c] = await Promise.all([
        supabase.from("academies").select("*", { count: "exact", head: true }),
        supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "teacher"),
        supabase.from("students").select("*", { count: "exact", head: true }),
        supabase.from("courses").select("*", { count: "exact", head: true }),
      ]);
      setCounts({
        academies: a.count ?? 0,
        teachers: t.count ?? 0,
        students: s.count ?? 0,
        courses: c.count ?? 0,
      });
    })();
  }, []);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard label="الأكاديميات" value={counts.academies} accent="primary" />
      <StatCard label="المعلمون" value={counts.teachers} accent="math" />
      <StatCard label="الطلاب" value={counts.students} accent="physics" />
      <StatCard label="الكورسات" value={counts.courses} accent="chemistry" />
    </div>
  );
}

// =================== ACADEMIES ===================
function AcademiesTab() {
  const [list, setList] = useState<Academy[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Academy | null>(null);

  async function refresh() {
    const { data } = await supabase.from("academies").select("*").order("created_at");
    setList((data ?? []) as Academy[]);
  }

  useEffect(() => { refresh(); }, []);

  async function togglePublish(a: Academy) {
    await supabase.from("academies").update({ is_published: !a.is_published }).eq("id", a.id);
    refresh();
  }

  async function remove(id: string) {
    if (!confirm("حذف الأكاديمية وكل محتواها؟")) return;
    await supabase.from("academies").delete().eq("id", id);
    refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold inline-flex items-center gap-2"><Layers className="size-5 text-primary" /> الأكاديميات ({list.length})</h2>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-glow-primary"
        >
          <Plus className="size-4" /> أكاديمية جديدة
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((a) => (
          <div key={a.id} className="bg-card-premium border border-border/60 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold mb-0.5">{a.name}</h3>
                <p className="text-xs text-muted-foreground">{a.subject} · /{a.slug}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${a.is_published ? "bg-green-500/15 text-green-400" : "bg-muted text-muted-foreground"}`}>
                {a.is_published ? "منشورة" : "مسودة"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">معلم: {a.teacher_name ?? "غير معيّن"}</p>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(a); setShowForm(true); }} className="flex-1 text-xs py-1.5 rounded-lg glass hover:bg-white/10 inline-flex items-center justify-center gap-1">
                <Edit2 className="size-3" /> تعديل
              </button>
              <button onClick={() => togglePublish(a)} className="text-xs px-2 py-1.5 rounded-lg glass hover:bg-white/10" title="نشر/إلغاء">
                <Power className="size-3.5" />
              </button>
              <button onClick={() => remove(a.id)} className="text-xs px-2 py-1.5 rounded-lg hover:bg-destructive/20 text-destructive">
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && <AcademyForm onClose={() => { setShowForm(false); refresh(); }} editing={editing} />}
    </div>
  );
}

function AcademyForm({ onClose, editing }: { onClose: () => void; editing: Academy | null }) {
  const [name, setName] = useState(editing?.name ?? "");
  const [subject, setSubject] = useState(editing?.subject ?? "");
  const [slug, setSlug] = useState(editing?.slug ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [teacherName, setTeacherName] = useState(editing?.teacher_name ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(editing?.image_url ?? null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(editing?.cover_image_url ?? null);
  const [accent, setAccent] = useState(editing?.accent_color ?? "oklch(0.6 0.2 250)");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function normalizeSlug(s: string): string {
    return s
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\p{L}\p{N}\-_]/gu, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function onSubmit(e: FormEvent) {
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
      name, subject, slug: cleanSlug,
      description,
      teacher_name: teacherName || null,
      image_url: imageUrl,
      cover_image_url: coverImageUrl,
      accent_color: accent,
    };
    const { error: err } = editing
      ? await supabase.from("academies").update(payload).eq("id", editing.id)
      : await supabase.from("academies").insert(payload);
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur grid place-items-center p-4">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold">{editing ? "تعديل الأكاديمية" : "أكاديمية جديدة"}</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded"><X className="size-5" /></button>
        </div>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="اسم الأكاديمية" value={name} onChange={setName} required />
            <Field label="المادة" value={subject} onChange={setSubject} required />
            <Field label="Portal Slug" value={slug} onChange={setSlug} required placeholder="physics" />
            <Field label="اسم المعلم (اختياري)" value={teacherName} onChange={setTeacherName} />
            <Field label="لون التمييز (CSS)" value={accent} onChange={setAccent} />
          </div>

          <ImageUploadField
            label="صورة الكارت في الصفحة الرئيسية"
            value={imageUrl}
            onChange={setImageUrl}
            folder="academies/cards"
            hint="تظهر في كارت الأكاديمية على الصفحة الرئيسية. مقترح 768×768."
          />

          <ImageUploadField
            label="صورة الغلاف (صفحة الأكاديمية قبل تسجيل الدخول)"
            value={coverImageUrl}
            onChange={setCoverImageUrl}
            folder="academies/covers"
            hint="تظهر في صفحة الأكاديمية الرئيسية وصفحة تسجيل الدخول."
          />

          <label className="block">
            <span className="block text-sm font-medium mb-2">الوصف</span>
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none"
            />
          </label>
          {error && <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 flex gap-2"><AlertCircle className="size-4 shrink-0" />{error}</div>}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg glass">إلغاء</button>
            <button disabled={saving} className="px-5 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-semibold">{saving ? "..." : "حفظ"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-2">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2.5 rounded-lg bg-input border border-border focus:border-primary focus:outline-none"
      />
    </label>
  );
}

// =================== TEACHERS ===================
function TeachersTab() {
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [academies, setAcademies] = useState<Academy[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null);
  const [resetting, setResetting] = useState<TeacherRow | null>(null);
  const [editing, setEditing] = useState<TeacherRow | null>(null);
  const [viewing, setViewing] = useState<TeacherRow | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function refresh() {
    const [{ data: list }, { data: acas }] = await Promise.all([
      // typed via Database after generation; cast for compile until types regen
      supabase.rpc("admin_list_teachers" as never) as unknown as Promise<{ data: TeacherRow[] | null }>,
      supabase.from("academies").select("*"),
    ]);
    setAcademies((acas ?? []) as Academy[]);
    setTeachers((list ?? []) as TeacherRow[]);
  }

  useEffect(() => { refresh(); }, []);

  async function toggleTeacher(t: TeacherRow) {
    setActionError(null);
    try {
      await setTeacherDisabled({ data: { accessToken: await getAccessToken(), userId: t.user_id, disabled: t.status === "active" } });
      refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "تعذّر تحديث الحالة");
    }
  }

  async function removeTeacher(t: TeacherRow) {
    if (!confirm("حذف حساب المعلم نهائيًا؟")) return;
    setActionError(null);
    try {
      await deleteTeacherAccount({ data: { accessToken: await getAccessToken(), userId: t.user_id } });
      refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "تعذّر حذف المعلم");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold inline-flex items-center gap-2"><Users className="size-5 text-primary" /> المعلمون ({teachers.length})</h2>
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-glow-primary">
          <Plus className="size-4" /> إنشاء معلم
        </button>
      </div>

      {actionError && <div className="mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 flex gap-2"><AlertCircle className="size-4 shrink-0" />{actionError}</div>}

      <div className="bg-card-premium border border-border/60 rounded-2xl p-6 overflow-x-auto">
        {teachers.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-12">لا يوجد معلمون بعد.</p>
        ) : (
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground text-xs">
                <th className="text-right py-3">الاسم</th>
                <th className="text-right py-3">Teacher ID</th>
                <th className="text-right py-3">البريد</th>
                <th className="text-right py-3">الأكاديمية</th>
                <th className="text-right py-3">الحالة</th>
                <th className="text-right py-3">تاريخ الإنشاء</th>
                <th className="text-right py-3">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t) => (
                <tr key={t.user_id} className="border-b border-border/30">
                  <td className="py-3 font-medium">{t.full_name || "—"}</td>
                  <td className="py-3 text-muted-foreground font-mono text-xs">{t.user_id.slice(0, 8)}</td>
                  <td className="py-3 text-muted-foreground inline-flex items-center gap-1.5"><Mail className="size-3.5" />{t.email}</td>
                  <td className="py-3 text-muted-foreground">{t.academy_name ?? "غير مرتبط"}</td>
                  <td className="py-3"><span className={`text-xs px-2 py-1 rounded-full ${t.status === "active" ? "bg-chemistry/15 text-chemistry" : "bg-muted text-muted-foreground"}`}>{t.status === "active" ? "نشط" : "معطل"}</span></td>
                  <td className="py-3 text-muted-foreground">{new Date(t.created_at).toLocaleDateString("ar")}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <button onClick={() => setViewing(t)} className="text-xs px-2 py-1 rounded glass hover:bg-white/10">عرض</button>
                      <button onClick={() => setEditing(t)} className="text-xs px-2 py-1 rounded glass hover:bg-white/10">تعديل</button>
                      <button onClick={() => toggleTeacher(t)} className="text-xs px-2 py-1 rounded glass hover:bg-white/10">{t.status === "active" ? "تعطيل" : "تفعيل"}</button>
                      <button onClick={() => setResetting(t)} className="text-xs px-2 py-1 rounded glass hover:bg-white/10" title="إعادة تعيين كلمة المرور">إعادة تعيين</button>
                      <button onClick={() => removeTeacher(t)} className="text-xs px-2 py-1 rounded hover:bg-destructive/20 text-destructive"><Trash2 className="size-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && <CreateTeacherForm academies={academies} onClose={(c) => { setShowForm(false); if (c) setCreated(c); refresh(); }} />}
      {resetting && <ResetPasswordForm teacher={resetting} onClose={() => setResetting(null)} />}
      {editing && <EditTeacherForm teacher={editing} academies={academies} onClose={() => { setEditing(null); refresh(); }} />}
      {viewing && <TeacherDetails teacher={viewing} onClose={() => setViewing(null)} />}

      {created && (
        <div className="fixed bottom-6 left-6 bg-green-500/15 border border-green-500/40 rounded-xl p-4 max-w-sm shadow-elevated z-50">
          <div className="flex items-center gap-2 mb-2 text-green-400 font-bold">
            <CheckCircle2 className="size-4" /> تم إنشاء حساب المعلم
          </div>
          <div className="text-xs space-y-1">
            <div><span className="text-muted-foreground">البريد:</span> <code className="bg-card px-1.5 py-0.5 rounded">{created.email}</code></div>
            <div><span className="text-muted-foreground">كلمة المرور:</span> <code className="bg-card px-1.5 py-0.5 rounded">{created.password}</code></div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">سلّم هذه البيانات للمعلم.</p>
          <button onClick={() => setCreated(null)} className="absolute top-2 left-2 p-1 hover:bg-white/10 rounded"><X className="size-3" /></button>
        </div>
      )}
    </div>
  );
}

function ResetPasswordForm({ teacher, onClose }: { teacher: TeacherRow; onClose: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await resetUserPassword({ data: { accessToken: await getAccessToken(), email: teacher.email, newPassword: password } });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur grid place-items-center p-4">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold">إعادة تعيين كلمة المرور</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded"><X className="size-5" /></button>
        </div>
        {done ? (
          <div className="space-y-3">
            <div className="text-sm bg-green-500/15 border border-green-500/40 rounded-lg p-3 text-green-400 inline-flex gap-2">
              <CheckCircle2 className="size-4 shrink-0" />
              تم تحديث كلمة المرور بنجاح. سلّمها للمعلم.
            </div>
            <div className="text-xs">
              <div>البريد: <code className="bg-input px-1.5 py-0.5 rounded">{teacher.email}</code></div>
              <div>كلمة المرور الجديدة: <code className="bg-input px-1.5 py-0.5 rounded">{password}</code></div>
            </div>
            <button onClick={onClose} className="w-full py-2 rounded-lg bg-gradient-primary text-primary-foreground font-semibold">تم</button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <p className="text-xs text-muted-foreground">للحساب: <code className="bg-input px-1.5 py-0.5 rounded">{teacher.email}</code></p>
            <label className="block">
              <span className="block text-sm font-medium mb-2">كلمة المرور الجديدة</span>
              <input
                type="text" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                className="w-full px-4 py-2.5 rounded-lg bg-input border border-border focus:border-primary focus:outline-none font-mono"
              />
            </label>
            {error && <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 flex gap-2"><AlertCircle className="size-4 shrink-0" />{error}</div>}
            <button disabled={saving} className="w-full py-2.5 rounded-lg bg-gradient-primary text-primary-foreground font-semibold">{saving ? "..." : "تحديث كلمة المرور"}</button>
          </form>
        )}
      </div>
    </div>
  );
}

function TeacherDetails({ teacher, onClose }: { teacher: TeacherRow; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur grid place-items-center p-4">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold">بيانات المعلم</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded"><X className="size-5" /></button>
        </div>
        <div className="space-y-3 text-sm">
          <Info label="Teacher ID" value={teacher.user_id} mono />
          <Info label="الاسم" value={teacher.full_name || "—"} />
          <Info label="البريد" value={teacher.email} />
          <Info label="الأكاديمية" value={teacher.academy_name ?? "غير مرتبط"} />
          <Info label="الحالة" value={teacher.status === "active" ? "نشط" : "معطل"} />
          <Info label="تاريخ الإنشاء" value={new Date(teacher.created_at).toLocaleString("ar")} />
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-lg bg-input px-3 py-2">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={mono ? "font-mono text-xs break-all" : "font-medium"}>{value}</div>
    </div>
  );
}

function EditTeacherForm({ teacher, academies, onClose }: { teacher: TeacherRow; academies: Academy[]; onClose: () => void }) {
  const [fullName, setFullName] = useState(teacher.full_name ?? "");
  const [academyId, setAcademyId] = useState(teacher.academy_id ?? academies[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await updateTeacherAccount({ data: { accessToken: await getAccessToken(), userId: teacher.user_id, fullName, academyId } });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر تحديث المعلم");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur grid place-items-center p-4">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold">تعديل بيانات المعلم</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded"><X className="size-5" /></button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="الاسم الكامل" value={fullName} onChange={setFullName} required />
          <label className="block">
            <span className="block text-sm font-medium mb-2">الأكاديمية</span>
            <select value={academyId} onChange={(e) => setAcademyId(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg bg-input border border-border focus:border-primary focus:outline-none">
              <option value="">اختر أكاديمية</option>
              {academies.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </label>
          {error && <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 flex gap-2"><AlertCircle className="size-4 shrink-0" />{error}</div>}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg glass">إلغاء</button>
            <button disabled={saving} className="px-5 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-semibold">{saving ? "..." : "حفظ"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CreateTeacherForm({ academies, onClose }: { academies: Academy[]; onClose: (created?: { email: string; password: string }) => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [academyId, setAcademyId] = useState(academies[0]?.id ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      // Server-side creation: bypasses email-confirm race, doesn't replace
      // the super admin's session, and inserts user_roles atomically.
      await createTeacherAccount({
        data: { accessToken: await getAccessToken(), fullName, email, password, academyId },
      });
      setSaving(false);
      onClose({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر الإنشاء");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur grid place-items-center p-4">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold">إنشاء حساب معلم</h3>
          <button onClick={() => onClose()} className="p-1 hover:bg-white/10 rounded"><X className="size-5" /></button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="الاسم الكامل" value={fullName} onChange={setFullName} required />
          <Field label="البريد الإلكتروني" value={email} onChange={setEmail} required />
          <label className="block">
            <span className="block text-sm font-medium mb-2">كلمة المرور (احفظها لتسليمها للمعلم)</span>
            <input
              type="text" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
              className="w-full px-4 py-2.5 rounded-lg bg-input border border-border focus:border-primary focus:outline-none font-mono"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium mb-2">الأكاديمية</span>
            <select
              value={academyId} onChange={(e) => setAcademyId(e.target.value)} required
              className="w-full px-4 py-2.5 rounded-lg bg-input border border-border focus:border-primary focus:outline-none"
            >
              <option value="">اختر أكاديمية</option>
              {academies.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </label>
          {error && <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 flex gap-2"><AlertCircle className="size-4 shrink-0" />{error}</div>}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => onClose()} className="px-4 py-2 rounded-lg glass">إلغاء</button>
            <button disabled={saving} className="px-5 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-semibold">{saving ? "..." : "إنشاء"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =================== MODERATION ===================
function ModerationTab() {
  const [items, setItems] = useState<{ id: string; title: string; academy_name?: string; is_published: boolean; type: "course" | "quiz" }[]>([]);

  async function refresh() {
    const [{ data: courses }, { data: quizzes }, { data: acas }] = await Promise.all([
      supabase.from("courses").select("id, title, is_published, academy_id"),
      supabase.from("quizzes").select("id, title, is_published, academy_id"),
      supabase.from("academies").select("id, name"),
    ]);
    const acaMap = new Map((acas ?? []).map((a) => [a.id, a.name]));
    const merged = [
      ...(courses ?? []).map((c) => ({ ...c, type: "course" as const, academy_name: acaMap.get(c.academy_id) })),
      ...(quizzes ?? []).map((q) => ({ ...q, type: "quiz" as const, academy_name: acaMap.get(q.academy_id) })),
    ];
    setItems(merged);
  }

  useEffect(() => { refresh(); }, []);

  async function togglePublish(it: { id: string; type: "course" | "quiz"; is_published: boolean }) {
    await supabase.from(it.type === "course" ? "courses" : "quizzes").update({ is_published: !it.is_published }).eq("id", it.id);
    refresh();
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-5 inline-flex items-center gap-2"><BookOpen className="size-5 text-primary" /> مراجعة المحتوى</h2>
      <div className="bg-card-premium border border-border/60 rounded-2xl p-6">
        {items.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-12">لا يوجد محتوى للمراجعة.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground text-xs">
                <th className="text-right py-3">العنوان</th>
                <th className="text-right py-3">النوع</th>
                <th className="text-right py-3">الأكاديمية</th>
                <th className="text-right py-3">الحالة</th>
                <th className="text-right py-3">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={`${it.type}-${it.id}`} className="border-b border-border/30">
                  <td className="py-3 font-medium">{it.title}</td>
                  <td className="py-3 text-muted-foreground">{it.type === "course" ? "كورس" : "اختبار"}</td>
                  <td className="py-3 text-muted-foreground">{it.academy_name ?? "—"}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${it.is_published ? "bg-green-500/15 text-green-400" : "bg-muted text-muted-foreground"}`}>
                      {it.is_published ? "منشور" : "مسودة"}
                    </span>
                  </td>
                  <td className="py-3">
                    <button onClick={() => togglePublish(it)} className="text-xs px-3 py-1.5 rounded-lg glass hover:bg-white/10">
                      {it.is_published ? "إلغاء النشر" : "نشر"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
