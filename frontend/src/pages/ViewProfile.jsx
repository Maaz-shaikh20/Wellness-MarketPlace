import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

import {
  User,
  ShieldCheck,
  Award,
  Info,
  Globe,
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#EFECE3] font-mono">
        <div className="w-12 h-12 border-4 border-[#1B3C53] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="tracking-[0.3em] uppercase text-[10px] font-black">
          Loading Profile...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFECE3] text-[#FF004D] font-mono font-black uppercase tracking-widest p-10 text-center">
        {error}
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="relative min-h-screen font-mono bg-[#EFECE3] text-[#1B3C53]">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white border shadow-lg text-[10px] font-black uppercase tracking-widest"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      {/* Background Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05]">
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
        <header className="rounded-[3.5rem] p-12 bg-white border shadow-2xl flex flex-col md:flex-row items-center gap-10">
          <div className="w-32 h-32 rounded-[2.5rem] bg-[#1B3C53] text-white flex items-center justify-center text-5xl font-black">
            {user.name?.charAt(0)}
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-5xl font-black uppercase italic">
                {user.name}
              </h1>

              {/* ROLE */}
              <span className="px-4 py-1 rounded-full text-[10px] font-black tracking-widest bg-[#FF004D] text-white">
                {user.role}
              </span>

              {/* PRACTITIONER STATUS */}
              {user.role === "PRACTITIONER" && practitionerStatus && (
                <span
                  className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest text-white
                    ${practitionerStatus === "VERIFIED" && "bg-green-600"}
                    ${practitionerStatus === "PENDING" && "bg-yellow-500"}
                    ${practitionerStatus === "REJECTED" && "bg-red-600"}
                  `}
                >
                  {practitionerStatus}
                </span>
              )}
            </div>

            <p className="text-sm font-bold opacity-60 tracking-wider">
              NETWORK_ID: {userId?.substring(0, 8)}...
            </p>

            <div className="flex items-center gap-2 opacity-50">
              <Globe size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Active Node
              </span>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* USER INFO */}
          <section className="rounded-[2.5rem] p-10 bg-white border shadow-lg space-y-6">
            <div className="flex items-center gap-3 border-b pb-4">
              <Info size={18} className="text-blue-500" />
              <h2 className="text-sm font-black uppercase tracking-[0.3em]">
                Core Credentials
              </h2>
            </div>

            <p className="font-bold italic uppercase flex items-center gap-2">
              <User size={14} /> {user.email}
            </p>

            <p className="font-bold italic uppercase flex items-center gap-2">
              <ShieldCheck size={14} /> ACCOUNT ACTIVE
            </p>
          </section>

          {/* PRACTITIONER */}
          {user.role === "PRACTITIONER" && practitioner && (
            <section className="rounded-[2.5rem] p-10 bg-[#1B3C53] text-white shadow-2xl space-y-4">
              <div className="flex items-center gap-3 border-b border-white/20 pb-4">
                <Award size={18} className="text-[#FF004D]" />
                <h2 className="text-sm font-black uppercase tracking-[0.3em]">
                  Professional Node
                </h2>
              </div>

              <p><b>Specialization:</b> {practitioner.specialization}</p>
              <p><b>Experience:</b> {practitioner.experience} years</p>
              <p><b>Qualification:</b> {practitioner.qualification}</p>

              {practitioner.clinicAddress && (
                <div className="flex items-start gap-2 mt-2 p-3 rounded-xl bg-white/10 border border-white/20">
                  <span className="text-lg">📍</span>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-0.5">Clinic Address</p>
                    <p className="text-sm font-semibold">{practitioner.clinicAddress}</p>
                  </div>
                </div>
              )}

              {/* REJECTION REASON */}
              {practitioner.rejectionReason && (
                <div className="mt-6 p-4 rounded-xl bg-red-600/20 border border-red-500">
                  <div className="flex items-center gap-2 font-black uppercase text-red-400 text-[11px]">
                    <XCircle size={14} />
                    Verification Rejected
                  </div>
                  <p className="mt-2 text-sm italic text-red-200">
                    {practitioner.rejectionReason}
                  </p>
                </div>
              )}

              {/* PENDING MESSAGE */}
              {!practitioner.verified && !practitioner.rejectionReason && (
                <div className="mt-6 p-4 rounded-xl bg-yellow-500/20 border border-yellow-400">
                  <div className="flex items-center gap-2 font-black uppercase text-yellow-300 text-[11px]">
                    <Clock size={14} />
                    Verification Pending
                  </div>
                  <p className="mt-2 text-sm italic">
                    Your profile is under admin review.
                  </p>
                </div>
              )}
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
