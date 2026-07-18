import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  ArrowLeft,
  TrendingUp,
  CheckCircle,
  Calendar,
  Zap,
  Award,
  Activity,
  BarChart2,
  Target,
} from "lucide-react";

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getMonthKey(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${d.getMonth()}`;
}

function last6Months() {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTH_LABELS[d.getMonth()] });
  }
  return months;
}

function last12Weeks() {
  const weeks = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    const start = new Date(d);
    start.setDate(start.getDate() - start.getDay());
    weeks.push({
      key: start.toISOString().slice(0, 10),
      label: `${start.getDate()} ${MONTH_LABELS[start.getMonth()]}`,
    });
  }
  return weeks;
}

function getWeekKey(dateStr) {
  const d = new Date(dateStr);
  const start = new Date(d);
  start.setDate(start.getDate() - start.getDay());
  return start.toISOString().slice(0, 10);
}

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────── */
function Counter({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;
    if (end === 0) return;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <>{display}</>;
}

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
function StatCard({ icon, label, value, suffix = "", color, delay }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div
      className="relative overflow-hidden rounded-3xl p-6 flex flex-col gap-3 transition-all duration-700"
      style={{
        background: color,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
      }}
    >
      <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
        {icon}
      </div>
      <div>
        <p className="text-3xl font-black text-white">
          <Counter value={value} />{suffix}
        </p>
        <p className="text-xs font-bold uppercase tracking-widest text-white/70 mt-0.5">{label}</p>
      </div>
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/5" />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   CSS BAR CHART (Sessions per month)
───────────────────────────────────────────── */
function BarChart({ data, max }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 300); return () => clearTimeout(t); }, []);
  return (
    <div className="flex items-end gap-3 h-48 pt-4">
      {data.map(({ label, count }, i) => {
        const pct = max > 0 ? (count / max) * 100 : 0;
        return (
          <div key={label} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="relative w-full flex items-end justify-center h-36">
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap z-10">
                {count} session{count !== 1 ? "s" : ""}
              </div>
              <div
                className="w-full rounded-t-xl transition-all ease-out"
                style={{
                  height: mounted ? `${Math.max(pct, count > 0 ? 4 : 0)}%` : "0%",
                  transitionDuration: `${600 + i * 80}ms`,
                  background: count > 0
                    ? `linear-gradient(to top, #4f46e5, #818cf8)`
                    : "#e2e8f0",
                }}
              />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
            {count > 0 && (
              <span className="text-xs font-bold text-indigo-600">{count}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   HORIZONTAL PROGRESS BAR (Therapy breakdown)
───────────────────────────────────────────── */
const THERAPY_COLORS = [
  "from-violet-500 to-purple-600",
  "from-teal-500 to-emerald-600",
  "from-orange-500 to-amber-600",
  "from-rose-500 to-pink-600",
  "from-blue-500 to-indigo-600",
];

function TherapyBar({ label, count, total, colorClass, delay }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), delay); return () => clearTimeout(t); }, [delay]);
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-bold text-slate-700 truncate max-w-[70%]">{label}</span>
        <span className="text-xs font-black text-slate-500">{count} · {pct}%</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorClass} transition-all ease-out`}
          style={{ width: mounted ? `${pct}%` : "0%", transitionDuration: "800ms" }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ACTIVITY HEATMAP (12 weeks)
───────────────────────────────────────────── */
function Heatmap({ weekData }) {
  const weeks = last12Weeks();
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {weeks.map(({ key, label }) => {
        const count = weekData[key] || 0;
        const intensity = count === 0 ? "bg-slate-100" : count === 1 ? "bg-indigo-200" : count === 2 ? "bg-indigo-400" : "bg-indigo-600";
        return (
          <div key={key} className="flex flex-col items-center gap-1.5 group flex-shrink-0">
            <div
              className={`w-10 h-10 rounded-xl ${intensity} transition-all duration-300 hover:scale-110 cursor-default relative`}
              title={`${label}: ${count} session${count !== 1 ? "s" : ""}`}
            >
              {count > 0 && (
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">
                  {count}
                </span>
              )}
            </div>
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 text-center leading-tight">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function ProgressTracker() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id;

  /* ── Fetch sessions ── */
  const loadSessions = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await api.get(`/sessions/user/${userId}`);
      setSessions(res.data || []);
    } catch (err) {
      console.error("Failed to load sessions:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  /* ── Derived stats ── */
  const total = sessions.length;
  const completed = sessions.filter(s => s.status?.toUpperCase() === "COMPLETED").length;
  const accepted  = sessions.filter(s => s.status?.toUpperCase() === "ACCEPTED").length;
  const cancelled = sessions.filter(s => s.status?.toUpperCase() === "CANCELLED").length;
  const acceptanceRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  /* ── Streak (consecutive weeks with ≥1 completed session) ── */
  const completedSessions = sessions.filter(s => s.status?.toUpperCase() === "COMPLETED");
  const completedWeekKeys = new Set(completedSessions.map(s => getWeekKey(s.dateTime)));
  let streak = 0;
  const weeks12 = last12Weeks();
  for (let i = weeks12.length - 1; i >= 0; i--) {
    if (completedWeekKeys.has(weeks12[i].key)) streak++;
    else break;
  }

  /* ── Sessions per month (last 6) ── */
  const months6 = last6Months();
  const sessionsByMonth = {};
  sessions.forEach(s => {
    if (s.status?.toUpperCase() === "COMPLETED") {
      const k = getMonthKey(s.dateTime);
      sessionsByMonth[k] = (sessionsByMonth[k] || 0) + 1;
    }
  });
  const monthData = months6.map(m => ({ label: m.label, count: sessionsByMonth[m.key] || 0 }));
  const maxMonthCount = Math.max(...monthData.map(m => m.count), 1);

  /* ── Therapy distribution ── */
  const therapyCount = {};
  completedSessions.forEach(s => {
    const name = s.therapyName || `Therapy #${s.therapyId}`;
    therapyCount[name] = (therapyCount[name] || 0) + 1;
  });
  const topTherapies = Object.entries(therapyCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  /* ── Weekly heatmap data ── */
  const weekData = {};
  completedSessions.forEach(s => {
    const k = getWeekKey(s.dateTime);
    weekData[k] = (weekData[k] || 0) + 1;
  });

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-100">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading your progress...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-50 text-slate-900">

      {/* ── BACK BUTTON ── */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => navigate("/my-sessions")}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-slate-200 shadow-sm font-semibold text-sm hover:shadow-md transition-all"
        >
          <ArrowLeft size={16} /> My Sessions
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-28 space-y-16">

        {/* ── HEADER ── */}
        <header className="space-y-3">
          <div className="flex items-center gap-2 text-violet-600">
            <TrendingUp size={14} />
            <span className="text-xs font-black uppercase tracking-widest">Wellness Analytics</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tight">
            Your <span className="text-violet-600">Progress</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-md">
            A snapshot of your wellness journey — sessions completed, streaks maintained, and therapies explored.
          </p>
        </header>

        {/* ── STAT CARDS ── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Activity size={20} />}
            label="Total Sessions"
            value={total}
            color="linear-gradient(135deg,#4f46e5,#7c3aed)"
            delay={0}
          />
          <StatCard
            icon={<CheckCircle size={20} />}
            label="Completed"
            value={completed}
            color="linear-gradient(135deg,#059669,#10b981)"
            delay={100}
          />
          <StatCard
            icon={<Target size={20} />}
            label="Completion Rate"
            value={acceptanceRate}
            suffix="%"
            color="linear-gradient(135deg,#d97706,#f59e0b)"
            delay={200}
          />
          <StatCard
            icon={<Zap size={20} />}
            label="Week Streak"
            value={streak}
            suffix={streak === 1 ? " wk" : " wks"}
            color="linear-gradient(135deg,#db2777,#ec4899)"
            delay={300}
          />
        </section>

        {/* ── BAR CHART + HEATMAP ── */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Sessions per month */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-2xl bg-indigo-100 flex items-center justify-center">
                <BarChart2 size={18} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="font-black text-slate-800 text-base uppercase tracking-tight">Completed Sessions</h2>
                <p className="text-xs text-slate-400 font-medium">Last 6 months</p>
              </div>
            </div>
            {completed > 0 ? (
              <BarChart data={monthData} max={maxMonthCount} />
            ) : (
              <EmptyState label="No completed sessions yet" />
            )}
          </section>

          {/* Therapy distribution */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-2xl bg-teal-100 flex items-center justify-center">
                <Award size={18} className="text-teal-600" />
              </div>
              <div>
                <h2 className="font-black text-slate-800 text-base uppercase tracking-tight">Therapy Breakdown</h2>
                <p className="text-xs text-slate-400 font-medium">Top therapies explored</p>
              </div>
            </div>
            {topTherapies.length > 0 ? (
              <div className="space-y-4 mt-2">
                {topTherapies.map(([name, count], i) => (
                  <TherapyBar
                    key={name}
                    label={name}
                    count={count}
                    total={completed}
                    colorClass={THERAPY_COLORS[i % THERAPY_COLORS.length]}
                    delay={i * 120}
                  />
                ))}
              </div>
            ) : (
              <EmptyState label="Complete sessions to see your therapy breakdown" />
            )}
          </section>
        </div>

        {/* ── ACTIVITY HEATMAP ── */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-2xl bg-rose-100 flex items-center justify-center">
              <Calendar size={18} className="text-rose-600" />
            </div>
            <div>
              <h2 className="font-black text-slate-800 text-base uppercase tracking-tight">Weekly Activity</h2>
              <p className="text-xs text-slate-400 font-medium">Completed sessions over the last 12 weeks</p>
            </div>
            {/* Legend */}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-bold">Less</span>
              {["bg-slate-100","bg-indigo-200","bg-indigo-400","bg-indigo-600"].map((c, i) => (
                <div key={i} className={`w-4 h-4 rounded ${c}`} />
              ))}
              <span className="text-[10px] text-slate-400 font-bold">More</span>
            </div>
          </div>
          {Object.keys(weekData).length > 0 ? (
            <Heatmap weekData={weekData} />
          ) : (
            <EmptyState label="Complete sessions to see your activity heatmap" />
          )}
        </section>

        {/* ── STATUS BREAKDOWN ── */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-2xl bg-amber-100 flex items-center justify-center">
              <Activity size={18} className="text-amber-600" />
            </div>
            <h2 className="font-black text-slate-800 text-base uppercase tracking-tight">Session Status Overview</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Completed", count: completed, color: "bg-emerald-500" },
              { label: "Accepted", count: accepted, color: "bg-blue-500" },
              { label: "Cancelled", count: cancelled, color: "bg-rose-500" },
              { label: "Other", count: total - completed - accepted - cancelled, color: "bg-slate-400" },
            ].map(({ label, count, color }) => (
              <div key={label} className="text-center p-4 bg-slate-50 rounded-2xl">
                <div className={`w-3 h-3 rounded-full ${color} mx-auto mb-2`} />
                <p className="text-2xl font-black text-slate-800">{count}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <div className="text-center py-8">
          <p className="text-slate-400 font-medium mb-4">
            Keep going! Consistent sessions lead to lasting wellness. 💚
          </p>
          <button
            onClick={() => navigate("/book-therapy")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-violet-600 text-white font-black text-sm uppercase tracking-widest hover:bg-violet-700 transition-all shadow-lg shadow-violet-200"
          >
            Book Another Session →
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-4xl mb-3">🌱</div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-300">{label}</p>
    </div>
  );
}
