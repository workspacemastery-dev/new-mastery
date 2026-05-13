import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { u as useAuth } from "./useAuth-CuQlxuo9.js";
import { s as supabase } from "./router-BfT70NIy.js";
import { P as PageContainer, a as PageHeader } from "./DashboardLayout-CKTD8bPJ.js";
import { L as LoaderCircle } from "./loader-circle-B8rYq1WK.js";
import { c as createLucideIcon } from "./createLucideIcon-DHqPreVB.js";
import { U as Users } from "./users-BIEQI_yv.js";
import { C as ClipboardList } from "./clipboard-list-D_SvJuHr.js";
import { C as CircleCheck } from "./circle-check-D9LZDFiz.js";
import { C as ChartColumn } from "./chart-column-lL-oaoZ_.js";
import { T as Trophy } from "./trophy-YWyvm5ya.js";
import { B as BookOpen } from "./book-open-D70hEmbw.js";
import { S as Search } from "./search-DCkidx3Y.js";
import { C as CircleX } from "./circle-x-DSbvlbuL.js";
import { C as CircleAlert } from "./circle-alert-c7tAyljS.js";
import { C as Calendar } from "./calendar-BmlfLAjy.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./useStudentAuth-Mzi_1DBf.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./log-out-ajI5jNrW.js";
import "./x-yy412flO.js";
const __iconNode$5 = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$5);
const __iconNode$4 = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]];
const ChevronDown = createLucideIcon("chevron-down", __iconNode$4);
const __iconNode$3 = [["path", { d: "m18 15-6-6-6 6", key: "153udz" }]];
const ChevronUp = createLucideIcon("chevron-up", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "m10 17 5-5-5-5", key: "1bsop3" }],
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4", key: "u53s6r" }]
];
const LogIn = createLucideIcon("log-in", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M12 20h.01", key: "zekei9" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 5.17-2.69", key: "1dl1wf" }],
  ["path", { d: "M19 12.859a10 10 0 0 0-2.007-1.523", key: "4k23kn" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 4.177-2.643", key: "1grhjp" }],
  ["path", { d: "M22 8.82a15 15 0 0 0-11.288-3.764", key: "z3jwby" }],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const WifiOff = createLucideIcon("wifi-off", __iconNode$1);
const __iconNode = [
  ["path", { d: "M12 20h.01", key: "zekei9" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 20 0", key: "dnpr2z" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 14 0", key: "1x1e6c" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }]
];
const Wifi = createLucideIcon("wifi", __iconNode);
function TeacherResultsPage() {
  const {
    user,
    role
  } = useAuth();
  const [academyId, setAcademyId] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [students, setStudents] = reactExports.useState([]);
  const [quizzes, setQuizzes] = reactExports.useState([]);
  const [attempts, setAttempts] = reactExports.useState([]);
  const [courses, setCourses] = reactExports.useState([]);
  const [sessions, setSessions] = reactExports.useState([]);
  const [now, setNow] = reactExports.useState(/* @__PURE__ */ new Date());
  const [search, setSearch] = reactExports.useState("");
  const [activeTab, setActiveTab] = reactExports.useState("results");
  const [expandedStudent, setExpandedStudent] = reactExports.useState(null);
  const [filterQuiz, setFilterQuiz] = reactExports.useState("all");
  reactExports.useEffect(() => {
    const interval = setInterval(() => setNow(/* @__PURE__ */ new Date()), 6e4);
    return () => clearInterval(interval);
  }, []);
  reactExports.useEffect(() => {
    if (!user || role !== "teacher") return;
    void (async () => {
      const {
        data: aca
      } = await supabase.from("academies").select("id").eq("teacher_id", user.id).maybeSingle();
      if (!aca) {
        setLoading(false);
        return;
      }
      setAcademyId(aca.id);
      const [studRes, quizRes, courseRes, sessRes] = await Promise.all([
        supabase.from("students").select("id,full_name,student_code,is_active,created_at").eq("academy_id", aca.id).order("created_at", {
          ascending: false
        }),
        supabase.from("quizzes").select("id,title,passing_score,duration_minutes").eq("academy_id", aca.id),
        supabase.from("courses").select("id,title,is_published,created_at").eq("academy_id", aca.id).order("sort_order"),
        // جلب جلسات الأكاديمية مباشرة بدون فلتر student_id
        supabase.from("student_sessions").select("id,student_id,academy_id,created_at,expires_at,logged_out_at").eq("academy_id", aca.id).order("created_at", {
          ascending: false
        })
      ]);
      const studList = studRes.data ?? [];
      const quizList = quizRes.data ?? [];
      setStudents(studList);
      setQuizzes(quizList);
      setCourses(courseRes.data ?? []);
      setSessions(sessRes.data ?? []);
      if (quizList.length > 0) {
        const {
          data: attData
        } = await supabase.from("quiz_attempts").select("id,quiz_id,student_id,score,total_points,status,submitted_at,started_at").in("quiz_id", quizList.map((q) => q.id)).eq("status", "submitted").order("submitted_at", {
          ascending: false
        });
        setAttempts(attData ?? []);
      }
      setLoading(false);
    })();
  }, [user, role]);
  const activeSessions = sessions.filter((s) => !s.logged_out_at && new Date(s.expires_at) > now);
  const activeStudentIds = new Set(activeSessions.map((s) => s.student_id));
  const submittedAttempts = attempts.filter((a) => a.status === "submitted");
  const passedCount = submittedAttempts.filter((a) => {
    const quiz = quizzes.find((q) => q.id === a.quiz_id);
    if (!quiz || a.total_points === 0) return false;
    return a.score / a.total_points * 100 >= quiz.passing_score;
  }).length;
  const avgScore = submittedAttempts.length ? Math.round(submittedAttempts.reduce((s, a) => s + (a.total_points > 0 ? a.score / a.total_points * 100 : 0), 0) / submittedAttempts.length) : 0;
  const filteredAttempts = submittedAttempts.filter((a) => {
    const student = students.find((s) => s.id === a.student_id);
    const quiz = quizzes.find((q) => q.id === a.quiz_id);
    const matchSearch = (student?.full_name ?? "").toLowerCase().includes(search.toLowerCase()) || (student?.student_code ?? "").toLowerCase().includes(search.toLowerCase()) || (quiz?.title ?? "").toLowerCase().includes(search.toLowerCase());
    const matchQuiz = filterQuiz === "all" || a.quiz_id === filterQuiz;
    return matchSearch && matchQuiz;
  });
  if (loading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageContainer, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid place-items-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin text-primary" }) }) });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "النتائج والتقارير", description: "نتائج الاختبارات وبيانات الطلاب" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-1 bg-card-premium border border-emerald-500/30 rounded-2xl p-5 flex items-center gap-3 relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-emerald-500/5 pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "size-11 rounded-xl bg-emerald-500/15 grid place-items-center shrink-0 relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "size-5 text-emerald-500" }),
          activeSessions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 size-3 rounded-full bg-emerald-500 animate-pulse" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-black", children: activeStudentIds.size }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "متصل الآن" })
        ] })
      ] }),
      [{
        label: "إجمالي الطلاب",
        value: students.length,
        icon: Users,
        color: "text-primary",
        bg: "bg-primary/10"
      }, {
        label: "محاولات مقدّمة",
        value: submittedAttempts.length,
        icon: ClipboardList,
        color: "text-amber-500",
        bg: "bg-amber-500/10"
      }, {
        label: "ناجحون",
        value: passedCount,
        icon: CircleCheck,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
      }, {
        label: "متوسط الأداء",
        value: `${avgScore}%`,
        icon: ChartColumn,
        color: "text-violet-500",
        bg: "bg-violet-500/10"
      }].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-5 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-11 rounded-xl ${s.bg} grid place-items-center shrink-0`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: `size-5 ${s.color}` }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-black", children: s.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: s.label })
        ] })
      ] }, s.label))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 p-1 bg-input rounded-xl mb-6 w-fit", children: [{
      key: "results",
      label: "نتائج الاختبارات",
      icon: Trophy
    }, {
      key: "students",
      label: "بيانات تسجيل الدخول",
      icon: Users
    }, {
      key: "courses",
      label: "الكورسات",
      icon: BookOpen
    }].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveTab(t.key), className: `inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === t.key ? "bg-gradient-primary text-primary-foreground shadow-glow-primary" : "text-muted-foreground hover:text-foreground"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "size-4" }),
      " ",
      t.label
    ] }, t.key)) }),
    activeTab === "results" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "ابحث باسم الطالب أو كود الطالب...", className: "w-full bg-input border border-border/60 rounded-lg pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filterQuiz, onChange: (e) => setFilterQuiz(e.target.value), className: "bg-input border border-border/60 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "كل الاختبارات" }),
          quizzes.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: q.id, children: q.title }, q.id))
        ] })
      ] }),
      filteredAttempts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "size-10 mx-auto mb-2 opacity-20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "لا توجد نتائج بعد." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] gap-3 px-5 py-3 bg-input/50 text-xs font-bold text-muted-foreground border-b border-border/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "الطالب" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "الاختبار" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "الدرجة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "النسبة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "الحالة" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "تاريخ التقديم" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/60", children: filteredAttempts.map((att) => {
          const student = students.find((s) => s.id === att.student_id);
          const quiz = quizzes.find((q) => q.id === att.quiz_id);
          const pct = att.total_points > 0 ? Math.round(att.score / att.total_points * 100) : 0;
          const passed = quiz ? pct >= quiz.passing_score : false;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr] gap-3 px-5 py-3.5 items-center text-sm hover:bg-input/30 transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: student?.full_name ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: student?.student_code })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground line-clamp-1", children: quiz?.title ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold", children: [
              att.score,
              " / ",
              att.total_points
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1.5 bg-border rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-full rounded-full ${passed ? "bg-emerald-500" : "bg-destructive"}`, style: {
                width: `${pct}%`
              } }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold", children: [
                pct,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full font-semibold w-fit ${passed ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-destructive/15 text-destructive"}`, children: [
              passed ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "size-3" }),
              passed ? "ناجح" : "راسب"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: att.submitted_at ? new Date(att.submitted_at).toLocaleDateString("ar-EG") : "—" })
          ] }, att.id);
        }) })
      ] })
    ] }),
    activeTab === "students" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "ابحث باسم الطالب أو الكود...", className: "w-full bg-input border border-border/60 rounded-lg pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" })
      ] }),
      students.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-10 mx-auto mb-2 opacity-20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "لا يوجد طلاب بعد." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: students.filter((s) => s.full_name.toLowerCase().includes(search.toLowerCase()) || s.student_code.toLowerCase().includes(search.toLowerCase())).sort((a, b) => {
        const aOnline = activeStudentIds.has(a.id) ? 1 : 0;
        const bOnline = activeStudentIds.has(b.id) ? 1 : 0;
        return bOnline - aOnline;
      }).map((student) => {
        const isOnline = activeStudentIds.has(student.id);
        const studentSessions = sessions.filter((s) => s.student_id === student.id).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const lastSession = studentSessions[0];
        const isExpanded = expandedStudent === student.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-2xl overflow-hidden transition-all border ${isOnline ? "bg-emerald-500/5 border-emerald-500/40" : "bg-card-premium border-border/60"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setExpandedStudent(isExpanded ? null : student.id), className: "w-full flex items-center gap-4 p-4 hover:bg-white/5 transition text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-11 rounded-full grid place-items-center font-bold text-base text-white transition-colors ${isOnline ? "bg-emerald-500" : "bg-destructive/70"}`, children: student.full_name.charAt(0) }),
              isOnline && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-emerald-400 border-2 border-card animate-pulse" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `font-bold text-sm ${isOnline ? "text-emerald-600 dark:text-emerald-300" : ""}`, children: student.full_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: student.student_code })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-[11px] border ${isOnline ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/40" : "bg-destructive/10 text-destructive border-destructive/20"}`, children: isOnline ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: "size-3" }),
                " متصل"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "size-3" }),
                " غير متصل"
              ] }) }),
              lastSession && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hidden sm:inline-flex items-center gap-1 text-[11px] text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "size-3 text-emerald-500" }),
                new Date(lastSession.created_at).toLocaleDateString("ar-EG")
              ] }),
              isExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "size-4 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4 text-muted-foreground" })
            ] })
          ] }),
          isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border/60 p-4 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-input/50 rounded-xl p-4 space-y-3 border border-border/60", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-muted-foreground flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-3.5 text-primary" }),
                " بيانات الحساب"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid sm:grid-cols-3 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mb-0.5", children: "الاسم الكامل" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: student.full_name })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mb-0.5", children: "Student ID" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "bg-primary/10 text-primary px-2 py-1 rounded font-mono text-xs font-bold", children: student.student_code })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mb-0.5", children: "تاريخ الإنشاء" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3 text-muted-foreground" }),
                    new Date(student.created_at).toLocaleDateString("ar-EG")
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "size-3.5 text-primary" }),
                "سجل الجلسات (",
                studentSessions.length,
                ")"
              ] }),
              studentSessions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center py-4 bg-input/30 rounded-xl", children: "لم يسجل دخولاً بعد." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-56 overflow-y-auto", children: studentSessions.slice(0, 15).map((sess) => {
                const sessActive = !sess.logged_out_at && new Date(sess.expires_at) > now;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-start gap-3 p-3 rounded-xl text-xs border ${sessActive ? "bg-emerald-500/5 border-emerald-500/20" : "bg-input/30 border-border/40"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-7 rounded-lg grid place-items-center shrink-0 mt-0.5 ${sessActive ? "bg-emerald-500/20" : "bg-input"}`, children: sessActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: "size-3.5 text-emerald-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "size-3.5 text-muted-foreground" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "size-3 text-emerald-500 shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "تسجيل الدخول:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: new Date(sess.created_at).toLocaleString("ar-EG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      }) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: `size-3 shrink-0 ${sessActive ? "text-emerald-400" : "text-muted-foreground"}` }),
                      sessActive ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-500 font-bold", children: "● متصل الآن" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "تسجيل الخروج:" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: sess.logged_out_at ? new Date(sess.logged_out_at).toLocaleString("ar-EG", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        }) : new Date(sess.expires_at).toLocaleString("ar-EG", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        }) + " (انتهاء)" })
                      ] })
                    ] })
                  ] }),
                  sessActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 self-center", children: "متصل" })
                ] }, sess.id);
              }) })
            ] })
          ] })
        ] }, student.id);
      }) })
    ] }),
    activeTab === "courses" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: courses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-10 mx-auto mb-2 opacity-20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "لا توجد كورسات بعد." })
    ] }) : courses.map((course) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card-premium border border-border/60 rounded-2xl p-5 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-11 rounded-xl bg-primary/10 grid place-items-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: course.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1 mt-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3" }),
          new Date(course.created_at).toLocaleDateString("ar-EG")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[11px] px-2.5 py-1 rounded-full font-semibold ${course.is_published ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/15 text-amber-600 dark:text-amber-400"}`, children: course.is_published ? "منشور" : "مسودة" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "عدد الطلاب" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm", children: students.filter((s) => s.is_active).length })
        ] })
      ] })
    ] }, course.id)) })
  ] });
}
export {
  TeacherResultsPage as component
};
