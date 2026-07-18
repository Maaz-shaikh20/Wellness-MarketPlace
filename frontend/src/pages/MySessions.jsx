import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PractitionerCard from "../components/PractitionerCard";
import {
  Calendar,
  XCircle,
  Activity,
  ArrowLeft,
  Star,
  Tag,
  FileText,
  User,
  CheckCircle,
  X,
  Send,
  MessageCircle,
} from "lucide-react";

/* ---- Inline Toast ---- */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold ${
        type === "error" ? "bg-rose-600 text-white" : "bg-emerald-600 text-white"
      }`}
    >
      {type === "error" ? <X size={16} /> : <CheckCircle size={16} />}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}

export default function MySessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelReason, setCancelReason] = useState("");
  const [activeCancelId, setActiveCancelId] = useState(null);
  const [toast, setToast] = useState(null);

  // Rating state: sessionId -> { rated, rating, comment, hoveredStar, submitting, open, draftRating, draftComment }
  const [ratingMap, setRatingMap] = useState({});

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id;

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchAndHydrateSessions = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/sessions/user/${userId}`);
        const rawSessions = res.data || [];

        const hydratedSessions = await Promise.all(
          rawSessions.map(async (session) => {
            try {
              const pRes = await api.get(`/practitioners/${session.practitionerId}`);
              const pData = pRes.data;

              const mappedPractitioner = {
                ...pData,
                email: null,
                name:
                  pData.name ||
                  `${pData.firstName || ""} ${pData.lastName || ""}`.trim() ||
                  "Consultant",
                specialization:
                  pData.specialization || pData.category || "Wellness Specialist",
                image:
                  pData.image ||
                  pData.profilePicture ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    pData.name || "P"
                  )}&background=1B3C53&color=fff`,
                clinicAddress: pData.clinicAddress || null,
              };

              return { ...session, practitioner: mappedPractitioner };
            } catch {
              return {
                ...session,
                practitioner: {
                  name: `Wellness Practitioner`,
                  id: session.practitionerId,
                },
              };
            }
          })
        );

        setSessions(hydratedSessions);

        // ── Pre-check ratings for all COMPLETED sessions ──
        const completedSessions = hydratedSessions.filter(
          (s) => s.status?.toUpperCase() === "COMPLETED"
        );
        const ratingChecks = await Promise.all(
          completedSessions.map(async (s) => {
            try {
              const r = await api.get(`/session-ratings/session/${s.id}/user/${userId}`);
              return { id: s.id, data: r.data };
            } catch {
              return { id: s.id, data: { rated: false } };
            }
          })
        );
        const initialRatingMap = {};
        ratingChecks.forEach(({ id, data }) => {
          initialRatingMap[id] = {
            rated: data.rated || false,
            rating: data.rating || 0,
            comment: data.comment || "",
            open: false,
            draftRating: 0,
            draftComment: "",
            hoveredStar: 0,
            submitting: false,
          };
        });
        setRatingMap(initialRatingMap);
      } catch (err) {
        console.error("Error fetching session data:", err);
        showToast("Failed to load sessions. Please refresh.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchAndHydrateSessions();
  }, [userId, showToast]);

  const cancelSession = async (id, status) => {
    try {
      if (status === "BOOKED") {
        await api.put(`/sessions/${id}/cancel`);
        setSessions((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, status: "CANCELLED", cancelledBy: "USER" } : s
          )
        );
        showToast("Session cancelled successfully.");
        return;
      }

      if (!cancelReason.trim()) {
        showToast("Please provide a reason for cancellation.", "error");
        return;
      }

      await api.put(`/sessions/${id}/cancel-with-reason`, { reason: cancelReason });

      setSessions((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                status: "CANCELLED",
                cancellationReason: cancelReason,
                cancelledBy: "USER",
              }
            : s
        )
      );

      setCancelReason("");
      setActiveCancelId(null);
      showToast("Cancellation request submitted.");
    } catch {
      showToast("Cancellation request failed. Please try again.", "error");
    }
  };

  // ── Rating helpers ──
  const updateRating = (sessionId, patch) => {
    setRatingMap((prev) => ({
      ...prev,
      [sessionId]: { ...prev[sessionId], ...patch },
    }));
  };

  const submitRating = async (session) => {
    const rm = ratingMap[session.id];
    if (!rm?.draftRating) {
      showToast("Please select a star rating.", "error");
      return;
    }
    updateRating(session.id, { submitting: true });
    try {
      await api.post("/session-ratings", {
        sessionId: session.id,
        userId,
        practitionerId: session.practitionerId,
        rating: rm.draftRating,
        comment: rm.draftComment,
      });
      updateRating(session.id, {
        rated: true,
        rating: rm.draftRating,
        comment: rm.draftComment,
        open: false,
        submitting: false,
      });
      showToast("Rating submitted! Thank you ⭐");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit rating.";
      showToast(msg, "error");
      updateRating(session.id, { submitting: false });
    }
  };

  const filterSessions = (statusList) =>
    sessions.filter((s) => statusList.includes(s.status?.toUpperCase()));

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#F7FAF9]">
        <div className="w-32 h-1 bg-slate-200 overflow-hidden relative rounded-full">
          <div className="absolute inset-0 bg-[#1B3C53] animate-loading-bar" />
        </div>
        <span className="mt-6 text-xs font-bold uppercase tracking-widest text-slate-500">
          Loading your sessions...
        </span>
        <style>{`
          @keyframes loading-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
          .animate-loading-bar { animation: loading-bar 1.2s infinite linear; }
        `}</style>
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-[#1B3C53] overflow-x-hidden">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-slate-200 shadow-sm font-semibold text-sm hover:shadow-md transition-all"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-28 space-y-24">
        <header className="space-y-4">
          <div className="flex items-center gap-2 text-[#FF004D]">
            <Activity size={14} />
            <span className="text-xs font-bold uppercase tracking-widest">Patient Dashboard</span>
          </div>
          <h1 className="text-6xl font-black uppercase italic">
            My <span className="text-[#FF004D]">Sessions</span>
          </h1>
          <button
            onClick={() => navigate("/progress")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 text-white text-xs font-black uppercase tracking-widest hover:bg-violet-700 transition-all shadow-lg"
          >
            📊 View Progress Tracker
          </button>
        </header>

        <div className="space-y-32">
          <SessionSection
            title="Booked / Active"
            icon={<Calendar size={20} />}
            sessions={filterSessions(["BOOKED"])}
            onCancel={cancelSession}
            activeCancelId={activeCancelId}
            setActiveCancelId={setActiveCancelId}
            cancelReason={cancelReason}
            setCancelReason={setCancelReason}
            ratingMap={ratingMap}
            updateRating={updateRating}
            submitRating={submitRating}
          />
          <SessionSection
            title="Accepted"
            icon={<Star size={20} className="text-emerald-500" />}
            sessions={filterSessions(["ACCEPTED"])}
            onCancel={cancelSession}
            activeCancelId={activeCancelId}
            setActiveCancelId={setActiveCancelId}
            cancelReason={cancelReason}
            setCancelReason={setCancelReason}
            ratingMap={ratingMap}
            updateRating={updateRating}
            submitRating={submitRating}
          />
          <SessionSection
            title="Completed / Archive"
            icon={<XCircle size={20} />}
            sessions={filterSessions(["REJECTED", "CANCELLED", "COMPLETED"])}
            isCancelled
            activeCancelId={activeCancelId}
            setActiveCancelId={setActiveCancelId}
            cancelReason={cancelReason}
            setCancelReason={setCancelReason}
            ratingMap={ratingMap}
            updateRating={updateRating}
            submitRating={submitRating}
          />
        </div>
      </div>
    </div>
  );
}

function SessionSection({
  title,
  sessions,
  onCancel,
  icon,
  isCancelled,
  activeCancelId,
  setActiveCancelId,
  cancelReason,
  setCancelReason,
  ratingMap = {},
  updateRating,
  submitRating,
}) {
  const formatDateTime = (dateStr) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString("en-GB"),
      time: d
        .toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .toLowerCase(),
    };
  };

  return (
    <section>
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-slate-50 rounded-2xl text-[#1B3C53] shadow-inner">{icon}</div>
        <h2 className="text-3xl font-bold uppercase tracking-tight">
          {title}{" "}
          <span className="ml-2 text-sm opacity-40">({sessions.length})</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sessions.length > 0 ? (
          sessions.map((s) => {
            const { date, time } = formatDateTime(s.dateTime);
            return (
              <div
                key={s.id}
                className={`flex flex-col rounded-[2.5rem] bg-[#1B3C53] p-2 text-white shadow-2xl transition-all duration-300 hover:scale-[1.01] ${
                  isCancelled ? "opacity-50 grayscale" : ""
                }`}
              >
                <PractitionerCard
                  practitioner={s.practitioner}
                  isBooked={["BOOKED", "ACCEPTED"].includes(s.status?.toUpperCase())}
                  onCancel={() => {
                    if (s.status === "BOOKED") {
                      onCancel(s.id, s.status);
                    } else {
                      setActiveCancelId(s.id);
                    }
                  }}
                  readOnly={true}
                />

                {activeCancelId === s.id && (
                  <div className="px-8 pb-6">
                    <textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Reason for cancellation..."
                      className="w-full p-3 rounded-xl text-sm text-[#1B3C53] outline-none"
                    />
                    <button
                      onClick={() => onCancel(s.id, s.status)}
                      className="mt-3 px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold uppercase"
                    >
                      Confirm Cancel
                    </button>
                  </div>
                )}

                <div className="px-8 pb-8 pt-4 space-y-4">
                  <div className="flex justify-between items-start border-t border-white/10 pt-4">
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">
                        Date: {date}
                      </p>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">
                        Time: {time}
                      </p>
                      {s.practitioner?.clinicAddress && (
                        <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                          📍 {s.practitioner.clinicAddress}
                        </p>
                      )}
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        s.status?.toUpperCase() === "ACCEPTED"
                          ? "bg-emerald-500"
                          : s.status?.toUpperCase() === "BOOKED"
                          ? "bg-blue-500"
                          : s.status?.toUpperCase() === "COMPLETED"
                          ? "bg-slate-500"
                          : "bg-red-500"
                      }`}
                    >
                      {s.status}
                    </div>
                  </div>

                  {/* ── CHAT BUTTON (ACCEPTED only) ── */}
                  {s.status?.toUpperCase() === "ACCEPTED" && (
                    <div className="pt-3 border-t border-white/10">
                      <button
                        onClick={() => navigate(`/chat/${s.id}`)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-[10px] font-black uppercase tracking-widest transition-all hover:scale-[1.03]"
                      >
                        <MessageCircle size={13} /> Chat with Practitioner
                      </button>
                    </div>
                  )}

                  {s.notes && (
                    <div className="flex items-start gap-2 pt-2 border-t border-white/5">
                      <FileText size={12} className="mt-1 text-white/40" />
                      <p className="text-[11px] leading-relaxed italic text-white/60">
                        &ldquo;{s.notes}&rdquo;
                      </p>
                    </div>
                  )}

                  {s.status === "REJECTED" && s.rejectedReason && (
                    <div className="flex items-start gap-2 pt-2 border-t border-white/5">
                      <FileText size={12} className="mt-1 text-red-300" />
                      <p className="text-[11px] leading-relaxed italic text-red-200">
                        Rejection reason: &ldquo;{s.rejectedReason}&rdquo;
                      </p>
                    </div>
                  )}

                  {/* ── STAR RATING SECTION (COMPLETED only) ── */}
                  {s.status?.toUpperCase() === "COMPLETED" && (() => {
                    const rm = ratingMap[s.id];
                    if (!rm) return null;

                    if (rm.rated) {
                      // Show submitted rating
                      return (
                        <div className="pt-3 border-t border-white/10">
                          <p className="text-[10px] font-black uppercase tracking-widest text-amber-300 mb-1">Your Rating</p>
                          <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                className={star <= rm.rating ? "text-amber-400 fill-amber-400" : "text-white/20"}
                              />
                            ))}
                            <span className="ml-2 text-xs text-white/60">{rm.rating}/5</span>
                          </div>
                          {rm.comment && (
                            <p className="text-[11px] italic text-white/50 mt-1">&ldquo;{rm.comment}&rdquo;</p>
                          )}
                        </div>
                      );
                    }

                    if (!rm.open) {
                      return (
                        <div className="pt-3 border-t border-white/10">
                          <button
                            onClick={() => updateRating(s.id, { open: true })}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition-all"
                          >
                            <Star size={12} className="fill-white" /> Rate This Session
                          </button>
                        </div>
                      );
                    }

                    // Open rating form
                    return (
                      <div className="pt-3 border-t border-white/10 space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-300">Rate your experience</p>
                        {/* Stars */}
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map((star) => (
                            <button
                              key={star}
                              onMouseEnter={() => updateRating(s.id, { hoveredStar: star })}
                              onMouseLeave={() => updateRating(s.id, { hoveredStar: 0 })}
                              onClick={() => updateRating(s.id, { draftRating: star })}
                              className="transition-transform hover:scale-125"
                            >
                              <Star
                                size={22}
                                className={
                                  star <= (rm.hoveredStar || rm.draftRating)
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-white/30"
                                }
                              />
                            </button>
                          ))}
                          {rm.draftRating > 0 && (
                            <span className="ml-2 text-xs text-amber-300 font-bold">{rm.draftRating}/5</span>
                          )}
                        </div>
                        {/* Comment */}
                        <textarea
                          value={rm.draftComment}
                          onChange={(e) => updateRating(s.id, { draftComment: e.target.value })}
                          placeholder="Share your experience (optional)..."
                          rows={2}
                          className="w-full p-2 rounded-xl text-xs text-[#1B3C53] outline-none resize-none"
                        />
                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => submitRating(s)}
                            disabled={rm.submitting || !rm.draftRating}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 disabled:opacity-50 transition-all"
                          >
                            <Send size={10} />
                            {rm.submitting ? "Submitting..." : "Submit"}
                          </button>
                          <button
                            onClick={() => updateRating(s.id, { open: false, draftRating: 0, draftComment: "", hoveredStar: 0 })}
                            className="px-3 py-1.5 rounded-xl bg-white/10 text-white/70 text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 border-2 border-dashed border-slate-100 rounded-[3rem] text-center text-slate-300 font-bold uppercase text-xs tracking-widest">
            No {title} sessions found
          </div>
        )}
      </div>
    </section>
  );
}