import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Loader2, Trophy, Users, ClipboardList, CheckCircle2,
  XCircle, Search, ChevronDown, ChevronUp, BarChart3,
  AlertCircle, Calendar, BookOpen, Activity,
  LogIn, Wifi, WifiOff,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/dashboard/teacher/results")({
  head: () => ({ meta: [{ title: "النتائج — EduVerse" }] }),
  component: TeacherResultsPage,
});

interface Student {
  id: string;
  full_name: string;
  student_code: string;
  is_active: boolean;
  created_at: string;
}
interface Quiz {
  id: string;
  title: string;
  passing_score: number;
  duration_minutes: number;
}
interface Attempt {
  id: string;
  quiz_id: string;
  student_id: string;
  score: number;
  total_points: number;
  status: string;
  submitted_at: string | null;
  started_at: string;
}
interface Course {
  id: string;
  title: string;
  is_published: boolean;
  created_at: string;
}
interface Session {
  logged_out_at: string | null;
  id: string;
  student_id: string;
  academy_id: string;
  created_at: string;
  expires_at: string;
}

function TeacherResultsPage() {
  const { user, role } = useAuth();
  const [academyId, setAcademyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [now, setNow] = useState(new Date());

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"results" | "students" | "courses">("results");
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [filterQuiz, setFilterQuiz] = useState<string>("all");

  // تحديث الوقت كل دقيقة لتحديث حالة الاتصال
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!user || role !== "teacher") return;
    void (async () => {
      const { data: aca } = await supabase
        .from("academies").select("id").eq("teacher_id", user.id).maybeSingle();
      if (!aca) { setLoading(false); return; }
      setAcademyId(aca.id);

      const [studRes, quizRes, courseRes, sessRes] = await Promise.all([
        supabase.from("students")
          .select("id,full_name,student_code,is_active,created_at")
          .eq("academy_id", aca.id)
          .order("created_at", { ascending: false }),
        supabase.from("quizzes")
          .select("id,title,passing_score,duration_minutes")
          .eq("academy_id", aca.id),
        supabase.from("courses")
          .select("id,title,is_published,created_at")
          .eq("academy_id", aca.id)
          .order("sort_order"),
        // جلب جلسات الأكاديمية مباشرة بدون فلتر student_id
        supabase.from("student_sessions")
          .select("id,student_id,academy_id,created_at,expires_at,logged_out_at")
          .eq("academy_id", aca.id)
          .order("created_at", { ascending: false }),
      ]);

      const studList = (studRes.data ?? []) as Student[];
      const quizList = (quizRes.data ?? []) as Quiz[];
      setStudents(studList);
      setQuizzes(quizList);
      setCourses((courseRes.data ?? []) as Course[]);
      setSessions((sessRes.data ?? []) as Session[]);

      if (quizList.length > 0) {
        const { data: attData } = await supabase
          .from("quiz_attempts")
          .select("id,quiz_id,student_id,score,total_points,status,submitted_at,started_at")
          .in("quiz_id", quizList.map((q) => q.id))
          .eq("status", "submitted")
          .order("submitted_at", { ascending: false });
        setAttempts((attData ?? []) as Attempt[]);
      }
      setLoading(false);
    })();
  }, [user, role]);

  // جلسات نشطة = expires_at في المستقبل
  const activeSessions = sessions.filter((s) => !s.logged_out_at && new Date(s.expires_at) > now);
  const activeStudentIds = new Set(activeSessions.map((s) => s.student_id));

  const submittedAttempts = attempts.filter((a) => a.status === "submitted");
  const passedCount = submittedAttempts.filter((a) => {
    const quiz = quizzes.find((q) => q.id === a.quiz_id);
    if (!quiz || a.total_points === 0) return false;
    return (a.score / a.total_points) * 100 >= quiz.passing_score;
  }).length;
  const avgScore = submittedAttempts.length
    ? Math.round(submittedAttempts.reduce((s, a) =>
        s + (a.total_points > 0 ? (a.score / a.total_points) * 100 : 0), 0
      ) / submittedAttempts.length)
    : 0;

  const filteredAttempts = submittedAttempts.filter((a) => {
    const student = students.find((s) => s.id === a.student_id);
    const quiz = quizzes.find((q) => q.id === a.quiz_id);
    const matchSearch =
      (student?.full_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (student?.student_code ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (quiz?.title ?? "").toLowerCase().includes(search.toLowerCase());
    const matchQuiz = filterQuiz === "all" || a.quiz_id === filterQuiz;
    return matchSearch && matchQuiz;
  });

  if (loading) return (
    <PageContainer>
      <div className="grid place-items-center py-20">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    </PageContainer>
  );

  return (
    <PageContainer>
      <PageHeader title="النتائج والتقارير" description="نتائج الاختبارات وبيانات الطلاب" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {/* Active sessions */}
        <div className="lg:col-span-1 bg-card-premium border border-emerald-500/30 rounded-2xl p-5 flex items-center gap-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
          <div className="size-11 rounded-xl bg-emerald-500/15 grid place-items-center shrink-0 relative">
            <Activity className="size-5 text-emerald-500" />
            {activeSessions.length > 0 && (
              <span className="absolute -top-1 -right-1 size-3 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </div>
          <div className="relative">
            <p className="text-2xl font-black">{activeStudentIds.size}</p>
            <p className="text-xs text-muted-foreground">متصل الآن</p>
          </div>
        </div>

        {[
          { label: "إجمالي الطلاب",  value: students.length,          icon: Users,        color: "text-primary",    bg: "bg-primary/10" },
          { label: "محاولات مقدّمة", value: submittedAttempts.length, icon: ClipboardList, color: "text-amber-500",  bg: "bg-amber-500/10" },
          { label: "ناجحون",         value: passedCount,              icon: CheckCircle2,  color: "text-emerald-500",bg: "bg-emerald-500/10" },
          { label: "متوسط الأداء",   value: `${avgScore}%`,           icon: BarChart3,     color: "text-violet-500", bg: "bg-violet-500/10" },
        ].map((s) => (
          <div key={s.label} className="bg-card-premium border border-border/60 rounded-2xl p-5 flex items-center gap-3">
            <div className={`size-11 rounded-xl ${s.bg} grid place-items-center shrink-0`}>
              <s.icon className={`size-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-2xl font-black">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-input rounded-xl mb-6 w-fit">
        {([
          { key: "results",  label: "نتائج الاختبارات",   icon: Trophy },
          { key: "students", label: "بيانات تسجيل الدخول", icon: Users },
          { key: "courses",  label: "الكورسات",            icon: BookOpen },
        ] as const).map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === t.key
                ? "bg-gradient-primary text-primary-foreground shadow-glow-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}>
            <t.icon className="size-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: Results ── */}
      {activeTab === "results" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="ابحث باسم الطالب أو كود الطالب..."
                className="w-full bg-input border border-border/60 rounded-lg pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <select value={filterQuiz} onChange={(e) => setFilterQuiz(e.target.value)}
              className="bg-input border border-border/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="all">كل الاختبارات</option>
              {quizzes.map((q) => <option key={q.id} value={q.id}>{q.title}</option>)}
            </select>
          </div>

          {filteredAttempts.length === 0 ? (
            <div className="bg-card-premium border border-border/60 rounded-2xl p-12 text-center">
              <Trophy className="size-10 mx-auto mb-2 opacity-20" />
              <p className="text-muted-foreground text-sm">لا توجد نتائج بعد.</p>
            </div>
          ) : (
            <div className="bg-card-premium border border-border/60 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] gap-3 px-5 py-3 bg-input/50 text-xs font-bold text-muted-foreground border-b border-border/60">
                <span>الطالب</span><span>الاختبار</span><span>الدرجة</span>
                <span>النسبة</span><span>الحالة</span><span>تاريخ التقديم</span>
              </div>
              <div className="divide-y divide-border/60">
                {filteredAttempts.map((att) => {
                  const student = students.find((s) => s.id === att.student_id);
                  const quiz = quizzes.find((q) => q.id === att.quiz_id);
                  const pct = att.total_points > 0 ? Math.round((att.score / att.total_points) * 100) : 0;
                  const passed = quiz ? pct >= quiz.passing_score : false;
                  return (
                    <div key={att.id} className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] gap-3 px-5 py-3.5 items-center text-sm hover:bg-input/30 transition">
                      <div>
                        <p className="font-semibold">{student?.full_name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{student?.student_code}</p>
                      </div>
                      <p className="text-muted-foreground line-clamp-1">{quiz?.title ?? "—"}</p>
                      <p className="font-bold">{att.score} / {att.total_points}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${passed ? "bg-emerald-500" : "bg-destructive"}`}
                            style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-bold">{pct}%</span>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full font-semibold w-fit ${
                        passed ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-destructive/15 text-destructive"
                      }`}>
                        {passed ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
                        {passed ? "ناجح" : "راسب"}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {att.submitted_at ? new Date(att.submitted_at).toLocaleDateString("ar-EG") : "—"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Students login data ── */}
      {activeTab === "students" && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث باسم الطالب أو الكود..."
              className="w-full bg-input border border-border/60 rounded-lg pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>

          {students.length === 0 ? (
            <div className="bg-card-premium border border-border/60 rounded-2xl p-12 text-center">
              <Users className="size-10 mx-auto mb-2 opacity-20" />
              <p className="text-muted-foreground text-sm">لا يوجد طلاب بعد.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {students
                .filter((s) =>
                  s.full_name.toLowerCase().includes(search.toLowerCase()) ||
                  s.student_code.toLowerCase().includes(search.toLowerCase())
                )
                // الطلاب المتصلون أولاً
                .sort((a, b) => {
                  const aOnline = activeStudentIds.has(a.id) ? 1 : 0;
                  const bOnline = activeStudentIds.has(b.id) ? 1 : 0;
                  return bOnline - aOnline;
                })
                .map((student) => {
                  const isOnline = activeStudentIds.has(student.id);
                  const studentSessions = sessions
                    .filter((s) => s.student_id === student.id)
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                  const lastSession = studentSessions[0];
                  const isExpanded = expandedStudent === student.id;

                  return (
                    <div key={student.id}
                      className={`rounded-2xl overflow-hidden transition-all border ${
                        isOnline
                          ? "bg-emerald-500/5 border-emerald-500/40"
                          : "bg-card-premium border-border/60"
                      }`}>
                      <button
                        onClick={() => setExpandedStudent(isExpanded ? null : student.id)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition text-right"
                      >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <div className={`size-11 rounded-full grid place-items-center font-bold text-base text-white transition-colors ${
                            isOnline ? "bg-emerald-500" : "bg-destructive/70"
                          }`}>
                            {student.full_name.charAt(0)}
                          </div>
                          {isOnline && (
                            <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-emerald-400 border-2 border-card animate-pulse" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-sm ${isOnline ? "text-emerald-600 dark:text-emerald-300" : ""}`}>
                            {student.full_name}
                          </p>
                          <p className="text-xs text-muted-foreground">{student.student_code}</p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {/* Connection badge */}
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[11px] border ${
                            isOnline
                              ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/40"
                              : "bg-destructive/10 text-destructive border-destructive/20"
                          }`}>
                            {isOnline
                              ? <><Wifi className="size-3" /> متصل</>
                              : <><WifiOff className="size-3" /> غير متصل</>
                            }
                          </span>

                          {/* Last login */}
                          {lastSession && (
                            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                              <LogIn className="size-3 text-emerald-500" />
                              {new Date(lastSession.created_at).toLocaleDateString("ar-EG")}
                            </span>
                          )}

                          {isExpanded
                            ? <ChevronUp className="size-4 text-muted-foreground" />
                            : <ChevronDown className="size-4 text-muted-foreground" />
                          }
                        </div>
                      </button>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="border-t border-border/60 p-4 space-y-4">
                          {/* Credentials */}
                          <div className="bg-input/50 rounded-xl p-4 space-y-3 border border-border/60">
                            <p className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                              <AlertCircle className="size-3.5 text-primary" /> بيانات الحساب
                            </p>
                            <div className="grid sm:grid-cols-3 gap-3">
                              <div>
                                <p className="text-[11px] text-muted-foreground mb-0.5">الاسم الكامل</p>
                                <p className="font-semibold text-sm">{student.full_name}</p>
                              </div>
                              <div>
                                <p className="text-[11px] text-muted-foreground mb-0.5">Student ID</p>
                                <code className="bg-primary/10 text-primary px-2 py-1 rounded font-mono text-xs font-bold">
                                  {student.student_code}
                                </code>
                              </div>
                              <div>
                                <p className="text-[11px] text-muted-foreground mb-0.5">تاريخ الإنشاء</p>
                                <p className="text-sm flex items-center gap-1">
                                  <Calendar className="size-3 text-muted-foreground" />
                                  {new Date(student.created_at).toLocaleDateString("ar-EG")}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Sessions log */}
                          <div>
                            <p className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1.5">
                              <Activity className="size-3.5 text-primary" />
                              سجل الجلسات ({studentSessions.length})
                            </p>
                            {studentSessions.length === 0 ? (
                              <p className="text-xs text-muted-foreground text-center py-4 bg-input/30 rounded-xl">
                                لم يسجل دخولاً بعد.
                              </p>
                            ) : (
                              <div className="space-y-2 max-h-56 overflow-y-auto">
                                {studentSessions.slice(0, 15).map((sess) => {
                                  const sessActive = !sess.logged_out_at && new Date(sess.expires_at) > now;
                                  return (
                                    <div key={sess.id}
                                      className={`flex items-start gap-3 p-3 rounded-xl text-xs border ${
                                        sessActive
                                          ? "bg-emerald-500/5 border-emerald-500/20"
                                          : "bg-input/30 border-border/40"
                                      }`}>
                                      <div className={`size-7 rounded-lg grid place-items-center shrink-0 mt-0.5 ${
                                        sessActive ? "bg-emerald-500/20" : "bg-input"
                                      }`}>
                                        {sessActive
                                          ? <Wifi className="size-3.5 text-emerald-500" />
                                          : <WifiOff className="size-3.5 text-muted-foreground" />
                                        }
                                      </div>
                                      <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center gap-1.5">
                                          <LogIn className="size-3 text-emerald-500 shrink-0" />
                                          <span className="text-muted-foreground">تسجيل الدخول:</span>
                                          <span className="font-semibold text-foreground">
                                            {new Date(sess.created_at).toLocaleString("ar-EG", {
                                              year: "numeric", month: "short", day: "numeric",
                                              hour: "2-digit", minute: "2-digit",
                                            })}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <WifiOff className={`size-3 shrink-0 ${sessActive ? "text-emerald-400" : "text-muted-foreground"}`} />
                                          {sessActive ? (
                                            <span className="text-emerald-500 font-bold">● متصل الآن</span>
                                          ) : (
                                            <>
                                              <span className="text-muted-foreground">تسجيل الخروج:</span>
                                              <span className="font-semibold text-foreground">
                                                {sess.logged_out_at
                                                  ? new Date(sess.logged_out_at).toLocaleString("ar-EG", {
                                                      year: "numeric", month: "short", day: "numeric",
                                                      hour: "2-digit", minute: "2-digit",
                                                    })
                                                  : new Date(sess.expires_at).toLocaleString("ar-EG", {
                                                      year: "numeric", month: "short", day: "numeric",
                                                      hour: "2-digit", minute: "2-digit",
                                                    }) + " (انتهاء)"
                                                }
                                              </span>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                      {sessActive && (
                                        <span className="bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 self-center">
                                          متصل
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* ── TAB: Courses ── */}
      {activeTab === "courses" && (
        <div className="space-y-3">
          {courses.length === 0 ? (
            <div className="bg-card-premium border border-border/60 rounded-2xl p-12 text-center">
              <BookOpen className="size-10 mx-auto mb-2 opacity-20" />
              <p className="text-muted-foreground text-sm">لا توجد كورسات بعد.</p>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="bg-card-premium border border-border/60 rounded-2xl p-5 flex items-center gap-4">
                <div className="size-11 rounded-xl bg-primary/10 grid place-items-center shrink-0">
                  <BookOpen className="size-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold">{course.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Calendar className="size-3" />
                    {new Date(course.created_at).toLocaleDateString("ar-EG")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${
                    course.is_published
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                  }`}>
                    {course.is_published ? "منشور" : "مسودة"}
                  </span>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">عدد الطلاب</p>
                    <p className="font-bold text-sm">{students.filter((s) => s.is_active).length}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </PageContainer>
  );
}

