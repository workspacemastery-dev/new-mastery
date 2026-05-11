import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  Loader2, Users, Plus, Copy, Power, Trash2, AlertCircle, CheckCircle2, Search, Pencil, X, Check,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/teacher/students")({
  head: () => ({ meta: [{ title: "إدارة الطلاب — EduVerse" }] }),
  component: TeacherStudents,
});

interface Student {
  id: string;
  student_code: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

function TeacherStudents() {
  const { user, role, loading: authLoading } = useAuth();
  const [academyId, setAcademyId] = useState<string | null>(null);
  const [academyName, setAcademyName] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justCreated, setJustCreated] = useState<Student | null>(null);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    if (!user || role !== "teacher") return;
    (async () => {
      const { data: aca } = await supabase
        .from("academies")
        .select("id, name")
        .eq("teacher_id", user.id)
        .maybeSingle();
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

  async function refresh(id: string) {
    const { data } = await supabase
      .from("students")
      .select("id, student_code, full_name, is_active, created_at")
      .eq("academy_id", id)
      .order("created_at", { ascending: false });
    setStudents((data ?? []) as Student[]);
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!academyId) return;
    setError(null);
    setCreating(true);
    const { data, error: rpcErr } = await supabase.rpc("create_student", {
      _academy_id: academyId,
      _full_name: name.trim(),
    });
    setCreating(false);
    if (rpcErr || !data) {
      setError(rpcErr?.message ?? "فشل إنشاء الطالب");
      return;
    }
    setJustCreated(data as unknown as Student);
    setName("");
    refresh(academyId);
  }

  async function toggleActive(s: Student) {
    await supabase.from("students").update({ is_active: !s.is_active }).eq("id", s.id);
    if (academyId) refresh(academyId);
  }

  async function deleteStudent(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا الطالب؟")) return;
    await supabase.from("students").delete().eq("id", id);
    if (academyId) refresh(academyId);
  }

  async function saveEdit(id: string) {
    const name = editName.trim();
    if (!name) return;
    await supabase.from("students").update({ full_name: name }).eq("id", id);
    setEditId(null);
    if (academyId) refresh(academyId);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
  }

  if (authLoading || loading) {
    return (
      <PageContainer>
        <div className="grid place-items-center py-20">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      </PageContainer>
    );
  }

  if (!academyId) {
    return (
      <PageContainer>
        <PageHeader title="إدارة الطلاب" description="" />
        <div className="bg-card-premium border border-border/60 rounded-2xl p-8 text-center">
          <p className="text-muted-foreground">لم يتم تعيينك لأكاديمية بعد.</p>
        </div>
      </PageContainer>
    );
  }

  const filtered = students.filter(
    (s) => s.full_name.includes(search) || s.student_code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <PageContainer>
      <PageHeader title={`طلاب ${academyName}`} description="أنشئ Student IDs ووزّعها على طلابك" />
      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="bg-card-premium border border-border/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold inline-flex items-center gap-2">
              <Users className="size-5 text-primary" />
              قائمة الطلاب ({students.length})
            </h2>
            <div className="relative">
              <Search className="size-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث بالاسم أو ID"
                className="pr-9 pl-3 py-2 text-sm rounded-lg bg-input border border-border focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-12">
              {students.length === 0 ? "لم تضف أي طالب بعد." : "لا توجد نتائج."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground text-xs">
                    <th className="text-right py-3 px-2">الاسم</th>
                    <th className="text-right py-3 px-2">Student ID</th>
                    <th className="text-right py-3 px-2">الحالة</th>
                    <th className="text-right py-3 px-2">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} className="border-b border-border/30 hover:bg-white/5">
                      <td className="py-3 px-2 font-medium">
                        {editId === s.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              autoFocus
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onKeyDown={(e) => { if (e.key === "Enter") saveEdit(s.id); if (e.key === "Escape") setEditId(null); }}
                              className="px-2 py-1 text-sm rounded bg-input border border-border focus:border-primary focus:outline-none"
                            />
                            <button onClick={() => saveEdit(s.id)} className="p-1 rounded hover:bg-green-500/20 text-green-400" title="حفظ">
                              <Check className="size-4" />
                            </button>
                            <button onClick={() => setEditId(null)} className="p-1 rounded hover:bg-white/10 text-muted-foreground" title="إلغاء">
                              <X className="size-4" />
                            </button>
                          </div>
                        ) : (
                          s.full_name
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <code className="bg-primary/10 text-primary px-2 py-1 rounded font-mono text-xs">{s.student_code}</code>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${s.is_active ? "bg-green-500/15 text-green-400" : "bg-muted text-muted-foreground"}`}>
                          {s.is_active ? "نشط" : "متوقف"}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-1">
                          <button onClick={() => copy(s.student_code)} className="p-1.5 rounded hover:bg-white/10 text-muted-foreground" title="نسخ ID">
                            <Copy className="size-4" />
                          </button>
                          <button onClick={() => { setEditId(s.id); setEditName(s.full_name); }} className="p-1.5 rounded hover:bg-white/10 text-muted-foreground" title="تعديل الاسم">
                            <Pencil className="size-4" />
                          </button>
                          <button onClick={() => toggleActive(s)} className="p-1.5 rounded hover:bg-white/10 text-muted-foreground" title="تفعيل/إيقاف">
                            <Power className="size-4" />
                          </button>
                          <button onClick={() => deleteStudent(s.id)} className="p-1.5 rounded hover:bg-destructive/20 text-destructive" title="حذف">
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <form onSubmit={onCreate} className="bg-card-premium border border-border/60 rounded-2xl p-6">
            <h3 className="font-bold mb-4 inline-flex items-center gap-2">
              <Plus className="size-4 text-primary" />
              إضافة طالب جديد
            </h3>
            <label className="block mb-3">
              <span className="block text-sm font-medium mb-2">اسم الطالب</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
                placeholder="أحمد محمد"
                className="w-full px-4 py-2.5 rounded-lg bg-input border border-border focus:border-primary focus:outline-none"
              />
            </label>
            {error && (
              <div className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 mb-3 flex gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <button
              disabled={creating}
              className="w-full py-2.5 rounded-lg bg-gradient-primary text-primary-foreground font-semibold disabled:opacity-60"
            >
              {creating ? "جارٍ الإنشاء..." : "توليد Student ID"}
            </button>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              سيُولَّد Student ID تلقائياً بصيغة <code className="text-foreground">STU-XXXX</code> وسيكون صالحاً فقط داخل أكاديميتك.
            </p>
          </form>

          {justCreated && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3 text-green-400">
                <CheckCircle2 className="size-5" />
                <span className="font-bold">تم إنشاء الطالب</span>
              </div>
              <div className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">الاسم:</span> {justCreated.full_name}</div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Student ID:</span>
                  <code className="bg-card px-2 py-1 rounded font-mono">{justCreated.student_code}</code>
                  <button onClick={() => copy(justCreated.student_code)} className="p-1 hover:text-primary">
                    <Copy className="size-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                سلّم هذه البيانات للطالب ليدخل من صفحة الأكاديمية.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
