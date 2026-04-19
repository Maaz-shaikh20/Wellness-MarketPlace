import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import PractitionerCard from "../components/PractitionerCard";
import { Calendar, XCircle, Activity, ArrowLeft, Star, Tag, FileText, User } from "lucide-react";

export default function MySessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelReason, setCancelReason] = useState("");
  const [activeCancelId, setActiveCancelId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id;

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
              // Fetch details using Practitioner ID
              const pRes = await api.get(`/practitioners/${session.practitionerId}`);
              const pData = pRes.data;

              const mappedPractitioner = {
                ...pData,
                // Ensure email is NOT passed or is overwritten if PractitionerCard uses it
                email: null, 
                displayId: `PRACTITIONER-ID: ${session.practitionerId}`,
                name: pData.name || `${pData.firstName || ''} ${pData.lastName || ''}`.trim() || "Consultant",
                specialization: pData.specialization || pData.category || "Wellness Specialist",
                image: pData.image || pData.profilePicture || `https://ui-avatars.com/api/?name=${session.practitionerId}&background=random`,
                clinicAddress: pData.clinicAddress || null
              };

              return { ...session, practitioner: mappedPractitioner };
            } catch (err) {
              return { ...session, practitioner: { name: `Practitioner #${session.practitionerId}`, id: session.practitionerId } };
            }
          })
        );

        setSessions(hydratedSessions);
      } catch (err) {
        console.error("❌ Error fetching session data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndHydrateSessions();
  }, [userId]);
const cancelSession = async (id, status) => {
  try {
    // CASE 1: BOOKED → cancel immediately (no reason)
    if (status === "BOOKED") {
      await api.put(`/sessions/${id}/cancel`);

      setSessions(prev =>
        prev.map(s =>
          s.id === id
            ? { ...s, status: "CANCELLED", cancelledBy: "USER" }
            : s
        )
      );
      return;
    }

    // CASE 2: ACCEPTED → reason required
    if (!cancelReason.trim()) {
      alert("Please provide a cancellation reason.");
      return;
    }

    await api.put(`/sessions/${id}/cancel-with-reason`, {
      reason: cancelReason
    });

    setSessions(prev =>
      prev.map(s =>
        s.id === id
          ? {
              ...s,
              status: "CANCELLED",
              cancellationReason: cancelReason,
              cancelledBy: "USER"
            }
          : s
      )
    );

    setCancelReason("");
    setActiveCancelId(null);
  } catch (err) {
    alert("Cancellation request failed.");
  }
};



  const filterSessions = (statusList) => 
    sessions.filter((s) => statusList.includes(s.status?.toUpperCase()));

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F7FAF9]">
      <div className="w-32 h-1 bg-slate-200 overflow-hidden relative rounded-full">
        <div className="absolute inset-0 bg-[#1B3C53] animate-loading-bar" />
      </div>
      <span className="mt-6 text-xs font-bold uppercase tracking-widest text-slate-500">Processing IDs...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-[#1B3C53] overflow-x-hidden">
      <div className="fixed top-6 left-6 z-50">
        <button onClick={() => navigate("/home")} className="flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-slate-200 shadow-sm font-semibold text-sm hover:shadow-md transition-all">
          <ArrowLeft size={16} /> Back to Home
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-28 space-y-24">
        <header className="space-y-4">
          <div className="flex items-center gap-2 text-[#FF004D]">
            <Activity size={14} />
            <span className="text-xs font-bold uppercase tracking-widest">User Dashboard</span>
          </div>
          <h1 className="text-6xl font-black uppercase italic">My <span className="text-[#FF004D]">Sessions</span></h1>
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
/>

<SessionSection
  title="Rejected / Archive"
  icon={<XCircle size={20} />}
  sessions={filterSessions(["REJECTED", "CANCELLED", "COMPLETED"])}
  isCancelled
  activeCancelId={activeCancelId}
  setActiveCancelId={setActiveCancelId}
  cancelReason={cancelReason}
  setCancelReason={setCancelReason}
/>

        
        </div>
      </div>
      
      <style>{`
        @keyframes loading-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-loading-bar { animation: loading-bar 1.2s infinite linear; }
      `}</style>
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
  setCancelReason
}) {

  const formatDateTime = (dateStr) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString('en-GB'),
      time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
    };
  };

  return (
    <section>
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-slate-50 rounded-2xl text-[#1B3C53] shadow-inner">{icon}</div>
        <h2 className="text-3xl font-bold uppercase tracking-tight">{title} <span className="ml-2 text-sm opacity-40">({sessions.length})</span></h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sessions.length > 0 ? (
          sessions.map((s) => {
            const { date, time } = formatDateTime(s.dateTime);
            return (
              <div key={s.id} className={`flex flex-col rounded-[2.5rem] bg-[#1B3C53] p-2 text-white shadow-2xl transition-all duration-300 hover:scale-[1.01] ${isCancelled ? "opacity-50 grayscale" : ""}`}>
                {/* Email is now hidden inside the practitioner object passed here */}
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
      className="w-full p-3 rounded-xl text-sm text-[#1B3C53]"
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
                      <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">Date: {date}</p>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">Time: {time}</p>
                      {s.practitioner?.clinicAddress && (
                        <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                          📍 {s.practitioner.clinicAddress}
                        </p>
                      )}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      s.status.toUpperCase() === 'ACCEPTED' ? 'bg-emerald-500' : 
                      s.status.toUpperCase() === 'BOOKED' ? 'bg-blue-500' : 'bg-red-500'
                    }`}>
                      {s.status}
                    </div>
                  </div>

                  {/* ID Section: Explicitly showing Practitioner ID instead of email */}
                  <div className="grid grid-cols-3 gap-2 py-3 px-4 bg-white/5 rounded-2xl">
                    <div className="flex flex-col items-center">
                      <Tag size={10} className="text-[#FF004D] mb-1" />
                      <span className="text-[9px] font-bold uppercase opacity-60">S-ID: {s.id}</span>
                    </div>
                    <div className="flex flex-col items-center border-x border-white/10">
                      <User size={10} className="text-[#FF004D] mb-1" />
                      <span className="text-[9px] font-bold uppercase opacity-80 text-emerald-400">P-ID: {s.practitionerId}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Activity size={10} className="text-[#FF004D] mb-1" />
                      <span className="text-[9px] font-bold uppercase opacity-60">T-ID: {s.therapyId}</span>
                    </div>
                  </div>

                  {s.notes && (
                    <div className="flex items-start gap-2 pt-2 border-t border-white/5">
                      <FileText size={12} className="mt-1 text-white/40" />
                      <p className="text-[11px] leading-relaxed italic text-white/60">"{s.notes}"</p>
                    </div>
                  )}
                  {s.status === "REJECTED" && s.rejectedReason && (
  <div className="flex items-start gap-2 pt-2 border-t border-white/5">
    <FileText size={12} className="mt-1 text-red-300" />
    <p className="text-[11px] leading-relaxed italic text-red-200">
      Rejection reason: "{s.rejectedReason}"
    </p>
  </div>
)}

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