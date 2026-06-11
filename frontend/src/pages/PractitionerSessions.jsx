import { useEffect, useState, useMemo } from "react";
import api from "../api/axios";
import PractitionerNavbar from "../components/PractitionerNavbar";
import {
  Calendar, Clock, CheckCircle2, XCircle, User, Activity,
  ArrowLeft, ChevronDown, ChevronUp, Loader2, FileText,
  RefreshCw, MessageSquare, Stethoscope, AlarmClock, Wallet,
  Ban, AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ── helpers ── */
const STATUS_META = {
  BOOKED:    { label: "Pending",    color: "bg-amber-100 text-amber-800 border-amber-200",  dot: "bg-amber-400" },
  ACCEPTED:  { label: "Accepted",   color: "bg-emerald-100 text-emerald-800 border-emerald-200", dot: "bg-emerald-500" },
  COMPLETED: { label: "Completed",  color: "bg-blue-100 text-blue-800 border-blue-200",     dot: "bg-blue-500" },
  REJECTED:  { label: "Rejected",   color: "bg-red-100 text-red-800 border-red-200",        dot: "bg-red-500" },
  CANCELLED: { label: "Cancelled",  color: "bg-slate-100 text-slate-600 border-slate-200",  dot: "bg-slate-400" },
};

function fmtDate(dt) {
  return new Date(dt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function fmtTime(dt) {
  return new Date(dt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}
function fmtDay(dt) {
  return new Date(dt).toLocaleDateString("en-IN", { weekday: "long" });
}

const TABS = [
  { key: "BOOKED",    label: "Pending" },
  { key: "ACCEPTED",  label: "Accepted" },
  { key: "COMPLETED", label: "Completed" },
  { key: "REJECTED",  label: "Rejected" },
  { key: "CANCELLED", label: "Cancelled" },
];

export default function PractitionerSessions() {
  const [sessions, setSessions] = useState([]);
  const [therapyMap, setTherapyMap] = useState({});    // therapyId → therapy obj
  const [userMap, setUserMap] = useState({});           // userId    → user name
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState("");
  const [activeRejectId, setActiveRejectId] = useState(null);
  const [notesDraft, setNotesDraft] = useState({});    // sessionId → notes string
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [activeTab, setActiveTab] = useState("BOOKED");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /* ── load sessions + enrichment ── */
  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const practitioner = JSON.parse(localStorage.getItem("practitioner"));
    if (!practitioner?.id) {
      setError("Practitioner session expired. Please login again.");
      setLoading(false);
      return;
    }
    try {
      const [sessRes, therapiesRes] = await Promise.all([
        api.get(`/sessions/practitioner/${practitioner.id}`),
        api.get(`/therapies/practitioner/${practitioner.id}`),
      ]);

      const sessData = sessRes.data || [];
      setSessions(sessData);

      // Build therapyMap from practitioner's own therapies
      const tMap = {};
      (therapiesRes.data || []).forEach(t => { tMap[t.id] = t; });

      // Fallback: fetch any therapyId not covered by the practitioner's list
      const missingTherapyIds = [...new Set(sessData.map(s => s.therapyId))].filter(id => !tMap[id]);
      await Promise.all(
        missingTherapyIds.map(async (tid) => {
          try {
            const res = await api.get(`/therapies/${tid}`);
            tMap[tid] = res.data;
          } catch { /* ignore */ }
        })
      );
      setTherapyMap(tMap);

      // Fetch user names for unique userIds
      const uniqueIds = [...new Set(sessData.map(s => s.userId))];
      const uMap = {};
      await Promise.all(
        uniqueIds.map(async (uid) => {
          try {
            const res = await api.get(`/users/${uid}`);
            uMap[uid] = res.data?.name || `Patient #${uid}`;
          } catch {
            uMap[uid] = `Patient #${uid}`;
          }
        })
      );
      setUserMap(uMap);
    } catch {
      setError("Failed to load session data. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  /* ── actions ── */
  const withLoad = (id, fn) => async () => {
    setActionLoading(p => ({ ...p, [id]: true }));
    try { await fn(); } finally {
      setActionLoading(p => ({ ...p, [id]: false }));
    }
  };

  const handleAccept = (id) => withLoad(id, async () => {
    await api.put(`/sessions/${id}/accept`);
    setSessions(p => p.map(s => s.id === id ? { ...s, status: "ACCEPTED" } : s));
    setActiveTab("ACCEPTED");
  })();

  const handleReject = (id) => withLoad(id, async () => {
    if (!rejectReason.trim()) { alert("Please provide a rejection reason."); return; }
    await api.put(`/sessions/${id}/reject-with-reason`, { reason: rejectReason });
    setSessions(p => p.map(s => s.id === id ? { ...s, status: "REJECTED", rejectedReason: rejectReason } : s));
    setRejectReason("");
    setActiveRejectId(null);
    setActiveTab("REJECTED");
  })();

  const handleComplete = (id) => withLoad(id, async () => {
    await api.patch(`/sessions/${id}`, { status: "COMPLETED" });
    setSessions(p => p.map(s => s.id === id ? { ...s, status: "COMPLETED" } : s));
    setActiveTab("COMPLETED");
  })();

  const handleSaveNotes = (id) => withLoad(id, async () => {
    const notes = notesDraft[id] ?? "";
    await api.patch(`/sessions/${id}`, { notes });
    setSessions(p => p.map(s => s.id === id ? { ...s, notes } : s));
    setNotesDraft(p => { const n = { ...p }; delete n[id]; return n; });
  })();

  /* ── derived data ── */
  const byTab = useMemo(() => {
    const map = {};
    TABS.forEach(t => { map[t.key] = sessions.filter(s => s.status === t.key); });
    return map;
  }, [sessions]);

  const stats = useMemo(() => ({
    total:     sessions.length,
    pending:   sessions.filter(s => s.status === "BOOKED").length,
    accepted:  sessions.filter(s => s.status === "ACCEPTED").length,
    completed: sessions.filter(s => s.status === "COMPLETED").length,
  }), [sessions]);

  /* ── loading screen ── */
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-14 h-14 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-5" />
      <span className="text-[11px] tracking-widest uppercase font-black text-slate-500">Loading sessions…</span>
    </div>
  );

  /* ── empty state ── */
  const EmptyState = ({ tab }) => (
    <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
      <Calendar size={48} className="text-slate-200 mb-5" />
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
        No {STATUS_META[tab]?.label} sessions
      </p>
    </div>
  );

  /* ── session card ── */
  const SessionCard = ({ s }) => {
    const therapy = therapyMap[s.therapyId];
    const patientName = userMap[s.userId] || `Patient #${s.userId}`;
    const meta = STATUS_META[s.status] || STATUS_META.BOOKED;
    const isExpanded = expandedId === s.id;
    const isRejecting = activeRejectId === s.id;
    const isLoading = !!actionLoading[s.id];
    const noteDraft = notesDraft[s.id];
    const currentNotes = noteDraft !== undefined ? noteDraft : (s.notes || "");

    return (
      <div className={`bg-white rounded-3xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden`}>
        {/* Card Header */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            {/* Left: Patient + Therapy */}
            <div className="flex items-start gap-4 min-w-0">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg shrink-0 shadow-sm">
                {patientName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-black text-slate-900 text-base leading-tight">{patientName}</p>
                <p className="text-xs text-slate-400 mt-0.5">Patient ID #{s.userId}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {therapy && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold">
                      <Stethoscope size={11} />
                      {therapy.name}
                    </span>
                  )}
                  {therapy?.category && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wide">
                      {therapy.category}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Status + Actions */}
            <div className="flex flex-col items-end gap-3 shrink-0">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wide border ${meta.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>

              {/* Action Buttons for BOOKED */}
              {s.status === "BOOKED" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAccept(s.id)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wide transition disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                    Accept
                  </button>
                  <button
                    onClick={() => setActiveRejectId(isRejecting ? null : s.id)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-black uppercase tracking-wide border border-red-200 transition disabled:opacity-50"
                  >
                    <XCircle size={13} />
                    Decline
                  </button>
                </div>
              )}

              {/* Mark Completed for ACCEPTED */}
              {s.status === "ACCEPTED" && (
                <button
                  onClick={() => handleComplete(s.id)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-black uppercase tracking-wide transition disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                  Mark Complete
                </button>
              )}
            </div>
          </div>

          {/* Date / Time / Price Row */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 rounded-2xl px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Date</p>
              <p className="font-bold text-slate-800 text-sm">{fmtDate(s.dateTime)}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{fmtDay(s.dateTime)}</p>
            </div>
            <div className="bg-slate-50 rounded-2xl px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Time</p>
              <p className="font-bold text-slate-800 text-sm">{fmtTime(s.dateTime)}</p>
              {therapy?.duration && (
                <p className="text-[10px] text-slate-400 mt-0.5">{therapy.duration} mins</p>
              )}
            </div>
            {therapy?.price != null && (
              <div className="bg-emerald-50 rounded-2xl px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Fee</p>
                <p className="font-black text-emerald-700 text-sm">₹{therapy.price.toLocaleString("en-IN")}</p>
              </div>
            )}
            <div className="bg-slate-50 rounded-2xl px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Session ID</p>
              <p className="font-bold text-slate-800 text-sm">#{s.id}</p>
            </div>
          </div>

          {/* Rejection Reason Form */}
          {isRejecting && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl space-y-3">
              <p className="text-xs font-bold text-red-700 flex items-center gap-2">
                <AlertTriangle size={14} />
                Provide a reason for declining this session:
              </p>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="e.g. Schedule conflict on this date..."
                rows={3}
                className="w-full p-3 rounded-xl text-sm border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleReject(s.id)}
                  disabled={isLoading}
                  className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-black uppercase tracking-wide transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Ban size={12} />}
                  Confirm Decline
                </button>
                <button
                  onClick={() => { setActiveRejectId(null); setRejectReason(""); }}
                  className="px-5 py-2 rounded-xl bg-white text-slate-600 text-xs font-bold border border-slate-200 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Cancellation / Rejection reason display */}
          {s.status === "CANCELLED" && s.cancellationReason && (
            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1.5">
                <MessageSquare size={11} />
                Cancellation Reason
              </p>
              <p className="text-sm text-slate-600 italic">"{s.cancellationReason}"</p>
              {s.cancelledBy && (
                <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-wide">
                  Cancelled by: {s.cancelledBy === "USER" ? "Patient" : "Practitioner"}
                </p>
              )}
            </div>
          )}
          {s.status === "REJECTED" && s.rejectedReason && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1 flex items-center gap-1.5">
                <MessageSquare size={11} />
                Rejection Reason
              </p>
              <p className="text-sm text-red-700 italic">"{s.rejectedReason}"</p>
            </div>
          )}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpandedId(isExpanded ? null : s.id)}
          className="w-full border-t border-slate-100 py-3 px-6 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition"
        >
          <span>{isExpanded ? "Hide" : "Show"} Details & Notes</span>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {/* Expanded Section */}
        {isExpanded && (
          <div className="border-t border-slate-100 p-6 space-y-5 bg-slate-50/50">
            {/* Therapy details */}
            {therapy && (
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Therapy Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {therapy.description && (
                    <p className="text-sm text-slate-600 leading-relaxed col-span-full">{therapy.description}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <AlarmClock size={14} className="text-slate-400" />
                    <span><strong>Duration:</strong> {therapy.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Wallet size={14} className="text-slate-400" />
                    <span><strong>Fee:</strong> ₹{therapy.price?.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Session Notes */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                <FileText size={11} />
                Clinical Notes
              </p>
              <textarea
                value={currentNotes}
                onChange={e => setNotesDraft(p => ({ ...p, [s.id]: e.target.value }))}
                placeholder="Add clinical notes, observations, or follow-up instructions..."
                rows={4}
                className="w-full p-4 rounded-2xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white resize-none"
              />
              {noteDraft !== undefined && (
                <button
                  onClick={() => handleSaveNotes(s.id)}
                  disabled={isLoading}
                  className="mt-2 px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-white text-xs font-black uppercase tracking-wide transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={12} className="animate-spin" /> : null}
                  Save Notes
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-900 font-sans">
      <PractitionerNavbar />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition hover:-translate-x-0.5"
        >
          <ArrowLeft size={14} strokeWidth={3} /> Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-0.5 w-10 bg-blue-500 rounded-full" />
            <span className="text-[11px] font-black uppercase tracking-widest text-blue-500">Appointment Management</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h1 className="text-5xl sm:text-6xl font-black tracking-tighter uppercase italic leading-none text-slate-900">
              Session <span className="text-blue-600">Queue</span>
            </h1>
            <button
              onClick={() => { setLoading(true); fetchAll(); }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-[11px] font-black uppercase tracking-wide transition shadow-sm"
            >
              <RefreshCw size={13} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Sessions",  value: stats.total,     bg: "bg-white",          text: "text-slate-900", sub: "text-slate-400" },
            { label: "Pending Review",  value: stats.pending,   bg: "bg-amber-50",       text: "text-amber-700", sub: "text-amber-400" },
            { label: "Upcoming",        value: stats.accepted,  bg: "bg-emerald-50",     text: "text-emerald-700", sub: "text-emerald-400" },
            { label: "Completed",       value: stats.completed, bg: "bg-blue-50",        text: "text-blue-700",  sub: "text-blue-400" },
          ].map(({ label, value, bg, text, sub }) => (
            <div key={label} className={`${bg} rounded-3xl p-5 border border-slate-100 shadow-sm`}>
              <p className={`text-[10px] font-black uppercase tracking-widest ${sub} mb-1`}>{label}</p>
              <p className={`text-4xl font-black ${text}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200 mb-8 overflow-x-auto">
          {TABS.map(({ key, label }) => {
            const count = byTab[key]?.length || 0;
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-5 py-3 text-[11px] font-black uppercase tracking-widest rounded-t-2xl whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-white border-t border-l border-r border-slate-200 text-slate-900 shadow-sm -mb-px"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {label}
                {count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${isActive ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-500"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-semibold flex items-center gap-3">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        {/* Session Cards */}
        <div className="space-y-5">
          {byTab[activeTab]?.length === 0
            ? <EmptyState tab={activeTab} />
            : byTab[activeTab].map(s => <SessionCard key={s.id} s={s} />)
          }
        </div>
      </main>
    </div>
  );
}
