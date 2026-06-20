import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

import {
  User,
  ShieldCheck,
  Award,
  Info,
  ArrowLeft,
  XCircle,
  Clock
} from "lucide-react";

export default function ViewProfile() {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [practitioner, setPractitioner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userRes = await api.get(`/users/${userId}`);
        setUser(userRes.data);

        if (userRes.data.role === "PRACTITIONER") {
          const pracRes = await api.get(`/practitioners/user/${userId}`);
          setPractitioner(pracRes.data);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, navigate]);

  /* =============================
     PRACTITIONER STATUS LOGIC
     ============================= */
  const getPractitionerStatus = () => {
    if (!practitioner) return null;
    if (practitioner.verified) return "VERIFIED";
    if (practitioner.rejectionReason) return "REJECTED";
    return "PENDING";
  };

  const practitionerStatus = getPractitionerStatus();

  /* =============================
     LOADING / ERROR
     ============================= */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-zinc-50">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="tracking-[0.2em] uppercase text-[10px] font-black text-slate-500">
          Loading Profile...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50 text-rose-700 font-bold uppercase tracking-widest p-10 text-center">
        {error}
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-zinc-50 to-teal-50/30 text-slate-800">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 shadow-md text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 transition-all"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      {/* Background Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div
          className="absolute inset-0 bg-repeat animate-mesh-pan"
          style={{
            backgroundImage:
              "url('https://www.transparenttextures.com/patterns/cubes.png')",
            backgroundSize: "150px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 space-y-12">

        {/* HEADER */}
        <header className="rounded-[2.5rem] p-10 bg-white border border-slate-100 shadow-xl flex flex-col md:flex-row items-center gap-8">
          <div className="w-28 h-28 rounded-3xl bg-slate-900 text-white flex items-center justify-center text-4xl font-extrabold shadow-lg">
            {user.name?.charAt(0)}
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                {user.name}
              </h1>

              {/* ROLE */}
              <span className="px-3.5 py-1 rounded-full text-[10px] font-black tracking-widest bg-slate-900 text-white uppercase">
                {user.role}
              </span>

              {/* PRACTITIONER STATUS */}
              {user.role === "PRACTITIONER" && practitionerStatus && (
                <span
                  className={`px-3.5 py-1 rounded-full text-[10px] font-black tracking-widest text-white uppercase
                    ${practitionerStatus === "VERIFIED" && "bg-emerald-600"}
                    ${practitionerStatus === "PENDING" && "bg-amber-500"}
                    ${practitionerStatus === "REJECTED" && "bg-rose-600"}
                  `}
                >
                  {practitionerStatus}
                </span>
              )}
            </div>

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Wellnest Registered Member
            </p>

            {/* Verified Account Badge - Conditional */}
            {user.role === "PRACTITIONER" && practitioner?.verified && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold w-fit mx-auto md:mx-0 shadow-sm">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Verified Practitioner</span>
              </div>
            )}
          </div>
        </header>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* USER INFO */}
          <section className="rounded-[2rem] p-8 bg-white border border-slate-100 shadow-md space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <Info size={18} className="text-blue-500" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">
                Account Information
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Email Address</p>
                <p className="font-semibold flex items-center gap-2 text-slate-800 text-sm">
                  <User size={14} className="text-slate-400" /> {user.email}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Account Status</p>
                <p className="font-semibold flex items-center gap-2 text-emerald-600 text-sm">
                  <ShieldCheck size={14} /> Active & Verified user
                </p>
              </div>
            </div>
          </section>

          {/* PRACTITIONER */}
          {user.role === "PRACTITIONER" && practitioner && (
            <section className="rounded-[2rem] p-8 bg-slate-900 text-white shadow-xl space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <Award size={18} className="text-teal-400" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-300">
                  Professional Profile
                </h2>
              </div>

              <div className="space-y-3.5 text-sm">
                <p><b className="text-teal-400">Specialization:</b> {practitioner.specialization || "General"}</p>
                <p><b className="text-teal-400">Experience:</b> {practitioner.experience ? `${practitioner.experience} years` : "N/A"}</p>
                <p><b className="text-teal-400">Qualification:</b> {practitioner.qualification || "Verified Practitioner"}</p>

                {practitioner.clinicAddress && (
                  <div className="flex items-start gap-2.5 mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-lg mt-0.5">📍</span>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-0.5">Clinic Address</p>
                      <p className="text-sm font-semibold text-white/95">{practitioner.clinicAddress}</p>
                    </div>
                  </div>
                )}

                {/* REJECTION REASON */}
                {practitioner.rejectionReason && (
                  <div className="mt-6 p-4 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-200">
                    <div className="flex items-center gap-2 font-black uppercase text-rose-400 text-[10px] tracking-wider">
                      <XCircle size={14} />
                      Verification Rejected
                    </div>
                    <p className="mt-2 text-xs italic text-rose-300/90 leading-relaxed">
                      {practitioner.rejectionReason}
                    </p>
                  </div>
                )}

                {/* PENDING MESSAGE */}
                {!practitioner.verified && !practitioner.rejectionReason && (
                  <div className="mt-6 p-4 rounded-2xl bg-amber-950/30 border border-amber-800 text-amber-200">
                    <div className="flex items-center gap-2 font-black uppercase text-amber-400 text-[10px] tracking-wider">
                      <Clock size={14} />
                      Verification Pending
                    </div>
                    <p className="mt-2 text-xs italic text-amber-300/90 leading-relaxed">
                      Your credentials are currently under review by our administration.
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      <style>{`
        @keyframes mesh-pan {
          from { background-position: 0 0; }
          to { background-position: 150px 150px; }
        }
        .animate-mesh-pan {
          animation: mesh-pan 60s linear infinite;
        }
      `}</style>
    </div>
  );
}
