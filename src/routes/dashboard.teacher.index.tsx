import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ClipboardList,
  Users,
  FileText,
  ArrowLeft,
  TrendingUp,
  Megaphone,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/teacher/")({
  head: () => ({ meta: [{ title: "لوحة المعلم — EduVerse" }] }),
  component: TeacherDashboardIndex,
});

const ARABIC_MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"];

function TeacherDashboardIndex() {
  const { user, role } = useAuth();
  const [academy, setAcademy] = useState<{ id: string; name: string; subject: string } | null>(null);
  const [studentCount, setStudentCount] = useState<number>(0);
  const [courseCount, setCourseCount] = useState<number>(0);
  const [quizCount, setQuizCount] = useState<number>(0);
  const [students, setStudents] = useState<Array<{ created_at: string }>>([]);
  const [attempts, setAttempts] = useState<Array<{ score: number; total_points: number }>>([]);

  useEffect(() => {
    if (!user || role !== "teacher") return;
    void (async () => {
      const { data: aca } = await supabase
        .from("academies")
        .select("id, name, subject")
        .eq("teacher_id", user.id)
        .maybeSingle();
      setAcademy(aca);
      if (!aca) return;

      const [enrRes, crsRes, qzRes, studentsRes] = await Promise.all([
        supabase.from("students").select("*", { count: "exact", head: true }).eq("academy_id", aca.id),
        supabase.from("courses").select("*", { count: "exact", head: true }).eq("academy_id", aca.id),
        supabase.from("quizzes").select("*", { count: "exact", head: true }).eq("academy_id", aca.id),
        supabase.from("students").select("created_at").eq("academy_id", aca.id),
      ]);
      setStudentCount(enrRes.count ?? 0);
      setCourseCount(crsRes.count ?? 0);
      setQuizCount(qzRes.count ?? 0);
      setStudents(studentsRes.data ?? []);

      // Fetch attempts for grade distribution
      const { data: quizIds } = await supabase
        .from("quizzes")
        .select("id")
        .eq("academy_id", aca.id);
      if (quizIds && quizIds.length > 0) {
        const { data: atts } = await supabase
          .from("quiz_attempts")
          .select("score, total_points")
          .in("quiz_id", quizIds.map((q) => q.id))
          .eq("status", "submitted");
        setAttempts(atts ?? []);
      }
    })();
  }, [user, role]);

  // Monthly enrollment chart data (last 6 months)
  const enrollmentData = useMemo(() => {
    const now = new Date();
    const buckets = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return { month: ARABIC_MONTHS[d.getMonth() % 6] || `ش${i + 1}`, key: `${d.getFullYear()}-${d.getMonth()}`, count: 0 };
    });
    students.forEach((s) => {
      const d = new Date(s.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const bucket = buckets.find((b) => b.key === key);
      if (bucket) bucket.count += 1;
    });
    return buckets;
  }, [students]);

  // Grade distribution
  const gradeData = useMemo(() => {
    const buckets = [
      { name: "ممتاز (90+)", min: 90, count: 0, color: "var(--chemistry)" },
      { name: "جيد جدًا (75-89)", min: 75, count: 0, color: "var(--math)" },
      { name: "جيد (60-74)", min: 60, count: 0, color: "var(--gold)" },
      { name: "أقل من 60", min: 0, count: 0, color: "var(--destructive)" },
    ];
    attempts.forEach((a) => {
      if (a.total_points <= 0) return;
      const pct = (a.score / a.total_points) * 100;
      const b = buckets.find((x) => pct >= x.min);
      if (b) b.count += 1;
    });
    return buckets.filter((b) => b.count > 0);
  }, [attempts]);

  const overallPerformance = useMemo(() => {
    if (attempts.length === 0) return 0;
    const total = attempts.reduce((sum, a) => sum + (a.total_points > 0 ? (a.score / a.total_points) * 100 : 0), 0);
    return Math.round(total / attempts.length);
  }, [attempts]);

  return (
    <PageContainer>
      <PageHeader
        title={academy ? `أهلاً، ${academy.name}` : "لوحة المعلم"}
        description={academy?.subject ?? "نظرة عامة على إحصائيات المنصة والأداء العام"}
      />

      {!academy && (
        <div className="bg-card-premium border border-border/60 rounded-2xl p-8 text-center mb-8">
          <h2 className="text-xl font-semibold mb-2">لم يتم تعيينك لأكاديمية بعد</h2>
          <p className="text-muted-foreground text-sm">
            يحتاج الأدمن العام إلى ربط حسابك بأكاديمية. يرجى التواصل مع الإدارة.
          </p>
        </div>
      )}

      {/* Colorful stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <ColorStatCard
          label="إجمالي الطلاب"
          value={studentCount}
          delta="+12%"
          icon={Users}
          tone="teal"
        />
        <ColorStatCard
          label="الاختبارات"
          value={quizCount}
          delta="+5"
          icon={ClipboardList}
          tone="amber"
        />
        <ColorStatCard
          label="الكورسات"
          value={courseCount}
          delta="+8"
          icon={BookOpen}
          tone="emerald"
        />
        <ColorStatCard
          label="الأداء العام"
          value={`${overallPerformance}%`}
          delta="+3%"
          icon={TrendingUp}
          tone="violet"
        />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-5 mb-8">
        {/* Monthly enrollments — Bar chart */}
        <div className="bg-card-premium border border-border/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-lg mb-1">تسجيلات الطلاب الشهرية</h3>
              <p className="text-xs text-muted-foreground">آخر 6 أشهر</p>
            </div>
            <div className="size-10 rounded-xl bg-[oklch(0.74_0.18_180)]/15 grid place-items-center">
              <TrendingUp className="size-5 text-[oklch(0.74_0.18_180)]" />
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
                <YAxis stroke="var(--muted-foreground)" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.75rem",
                    fontSize: "0.875rem",
                  }}
                  cursor={{ fill: "oklch(1 0 0 / 0.04)" }}
                />
                <Bar dataKey="count" fill="oklch(0.74 0.18 180)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade distribution — Pie chart */}
        <div className="bg-card-premium border border-border/60 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-lg mb-1">توزيع الدرجات</h3>
              <p className="text-xs text-muted-foreground">جميع نتائج الاختبارات</p>
            </div>
            <div className="size-10 rounded-xl bg-chemistry/15 grid place-items-center">
              <GraduationCap className="size-5 text-chemistry" />
            </div>
          </div>
          {gradeData.length === 0 ? (
            <div className="h-64 grid place-items-center text-sm text-muted-foreground">
              لا نتائج بعد
            </div>
          ) : (
            <div className="h-64 flex items-center gap-4">
              <div className="flex-1 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gradeData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {gradeData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} stroke="var(--card)" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "0.75rem",
                        fontSize: "0.875rem",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {gradeData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2 text-xs">
                    <span className="size-3 rounded-sm" style={{ background: entry.color }} />
                    <span className="text-foreground">{entry.name}</span>
                    <span className="text-muted-foreground">({entry.count})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="size-4 text-primary" />
          <h2 className="text-lg font-bold">إجراءات سريعة</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SectionLink to="/dashboard/teacher/courses" icon={BookOpen} title="الكورسات" desc="إنشاء وحدات ودروس" tone="violet" />
          <SectionLink to="/dashboard/teacher/quizzes" icon={ClipboardList} title="الاختبارات" desc="أنشئ اختبارات وتابع النتائج" tone="amber" />
          <SectionLink to="/dashboard/teacher/students" icon={Users} title="الطلاب" desc="إدارة Student IDs" tone="teal" />
          <SectionSoon icon={Megaphone} title="الإعلانات" desc="نشر إعلانات للطلاب" />
        </div>
      </div>
    </PageContainer>
  );
}

type Tone = "teal" | "amber" | "emerald" | "violet";

const TONE_STYLES: Record<Tone, { bg: string; ring: string; text: string }> = {
  teal: {
    bg: "bg-[oklch(0.74_0.18_180)]/15",
    ring: "ring-[oklch(0.74_0.18_180)]/20",
    text: "text-[oklch(0.74_0.18_180)]",
  },
  amber: {
    bg: "bg-gold/15",
    ring: "ring-gold/20",
    text: "text-gold",
  },
  emerald: {
    bg: "bg-chemistry/15",
    ring: "ring-chemistry/20",
    text: "text-chemistry",
  },
  violet: {
    bg: "bg-physics/15",
    ring: "ring-physics/20",
    text: "text-physics",
  },
};

function ColorStatCard({
  label,
  value,
  delta,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number | string;
  delta: string;
  icon: typeof Users;
  tone: Tone;
}) {
  const style = TONE_STYLES[tone];
  return (
    <div className="bg-card-premium border border-border/60 rounded-2xl p-5 hover:border-border transition group">
      <div className="flex items-start justify-between mb-4">
        <div className={`size-12 rounded-xl ${style.bg} ring-1 ${style.ring} grid place-items-center`}>
          <Icon className={`size-6 ${style.text}`} />
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full bg-chemistry/15 text-chemistry font-semibold">
          {delta}
        </span>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function SectionLink({
  to,
  icon: Icon,
  title,
  desc,
  tone,
}: {
  to: "/dashboard/teacher/courses" | "/dashboard/teacher/quizzes" | "/dashboard/teacher/students";
  icon: typeof Users;
  title: string;
  desc: string;
  tone: Tone;
}) {
  const style = TONE_STYLES[tone];
  return (
    <Link
      to={to}
      className="block bg-card-premium border border-border/60 rounded-2xl p-5 hover:scale-[1.02] hover:border-primary/40 transition group"
    >
      <div className={`size-11 rounded-xl ${style.bg} ring-1 ${style.ring} grid place-items-center mb-3`}>
        <Icon className={`size-5 ${style.text}`} />
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{desc}</p>
      <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
        فتح <ArrowLeft className="size-3 group-hover:-translate-x-0.5 transition-transform" />
      </span>
    </Link>
  );
}

function SectionSoon({ icon: Icon, title, desc }: { icon: typeof Users; title: string; desc: string }) {
  return (
    <div className="bg-card-premium border border-border/60 rounded-2xl p-5 opacity-60">
      <div className="size-11 rounded-xl bg-muted grid place-items-center mb-3">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{desc}</p>
      <span className="inline-block text-xs px-2 py-1 rounded-full glass text-muted-foreground">قريبًا</span>
    </div>
  );
}
