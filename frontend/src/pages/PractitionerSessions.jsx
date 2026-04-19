import { useEffect, useState } from "react";
import api from "../api/axios";
import PractitionerNavbar from "../components/PractitionerNavbar";
import { Calendar, Clock, ArrowRight, CheckCircle2, XCircle, User, Activity, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PractitionerSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState("");
  const [activeRejectId, setActiveRejectId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const practitioner = JSON.parse(localStorage.getItem("practitioner"));

    if (!practitioner || !practitioner.id) {
      setError("Practitioner session expired. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.get(`/sessions/practitioner/${practitioner.id}`);
      setSessions(res.data);
    } catch (err) {
      setError("Failed to synchronize session data.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- BACKEND CONNECTED ACTIONS ---------- */

  const handleAccept = async (id) => {
    try {
      await api.put(`/sessions/${id}/accept`);
      setSessions(prev =>
        prev.map(s => s.id === id ? { ...s, status: "ACCEPTED" } : s)
      );
    } catch (err) {
      alert("Accept Failed");
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) {
      alert("Please provide a rejection reason.");
      return;
    }

    try {
      await api.put(`/sessions/${id}/reject-with-reason`, {
        reason: rejectReason
      });

      setSessions(prev => prev.filter(s => s.id !== id));
      setRejectReason("");
      setActiveRejectId(null);
    } catch (err) {
      alert("Reject Failed");
    }
  };

  /* ---------- DERIVED UI STATE ---------- */
  const incomingSessions = sessions.filter(s => s.status === "BOOKED");
  const approvedSessions = sessions.filter(s => s.status === "ACCEPTED" || s.status === "CANCELLED");

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#EFECE3]">
        <div className="w-16 h-16 border-2 border-[#1B3C53]/10 border-t-[#FF004D] rounded-full animate-spin mb-6" />
        <span className="tracking-[0.5em] uppercase text-[10px] font-black text-[#1B3C53]">
          Syncing Schedule
        </span>
      </div>
    );
  }

  const EmptyState = ({ label }) => (
    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[#1B3C53]/10 rounded-[3rem] bg-white/20">
      <Calendar size={40} className="opacity-20 mb-4" />
      <p className="text-[10px] uppercase tracking-[0.4em] font-black opacity-40">
        {label}
      </p>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#EFECE3] text-[#1B3C53] font-sans selection:bg-[#FF004D] selection:text-white">

      <div className="fixed inset-0 pointer-events-none opacity-[0.04]">
        <div
          className="absolute inset-0 bg-repeat animate-mesh-pan"
          style={{
            backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')",
            backgroundSize: "150px"
          }}
        />
      </div>

      <PractitionerNavbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">

        <button
          onClick={() => navigate(-1)}
          className="mb-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-all hover:-translate-x-1"
        >
          <ArrowLeft size={14} strokeWidth={3} /> Dashboard
        </button>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#1B3C53]/10 pb-16 mb-20 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-[2px] w-12 bg-[#FF004D]" />
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[#FF004D]">
                Appointment Log
              </span>
            </div>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase italic">
              SESSION <br />
              <span className="text-blue-600">QUEUE</span>
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-7 space-y-10">

            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40 flex items-center gap-3">
              <Activity size={14} className="text-[#FF004D]" /> Incoming Requests
            </h2>

            {incomingSessions.length === 0 ? (
              <EmptyState label="No requests in queue" />
            ) : (
              incomingSessions.map(s => {
                const d = new Date(s.dateTime);
                return (
                  <div
                    key={s.id}
                    className="bg-white/70 border border-[#1B3C53]/5 p-8 rounded-[2.5rem]"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-black">UID-{s.userId}</p>
                        <p className="text-xs opacity-50">
                          {d.toLocaleDateString()}{" "}
                          {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAccept(s.id)}
                            className="p-4 rounded-2xl bg-green-500 text-white"
                          >
                            <CheckCircle2 size={20} />
                          </button>

                          <button
                            onClick={() => setActiveRejectId(s.id)}
                            className="p-4 rounded-2xl bg-red-500 text-white"
                          >
                            <XCircle size={20} />
                          </button>
                        </div>

                        {activeRejectId === s.id && (
                          <div>
                            <textarea
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              placeholder="Reason for rejection..."
                              className="w-full p-3 rounded-xl text-sm border"
                            />
                            <button
                              onClick={() => handleReject(s.id)}
                              className="mt-3 px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold uppercase"
                            >
                              Confirm Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ===== VERIFIED REGISTRY ===== */}
          <div className="lg:col-span-5 space-y-10">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">
              Verified Registry
            </h2>

            {approvedSessions.length === 0 ? (
              <EmptyState label="No verified records" />
            ) : (
              approvedSessions.map(s => (
                <div
                  key={s.id}
                  className="p-6 bg-white/40 border-2 border-dashed border-[#1B3C53]/10 rounded-[2.5rem]"
                >
                  <div className="space-y-2">
                    <p className="font-black">UID-{s.userId}</p>

                    {s.status === "CANCELLED" &&
                      s.cancelledBy === "USER" &&
                      s.cancellationReason && (
                        <p className="text-xs italic text-red-600">
                          Cancelled by user: "{s.cancellationReason}"
                        </p>
                      )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
