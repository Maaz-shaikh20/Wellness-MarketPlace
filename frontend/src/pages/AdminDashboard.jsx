import RejectPractitionerModal from "../components/RejectPractitionerModal";
import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  CheckCircle,
  XCircle,
  ShieldCheck,
  ArrowLeft,
  LogOut,
  ExternalLink,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [practitioners, setPractitioners] = useState([]);
  const [userNames, setUserNames] = useState({}); // New state to store {userId: name}
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedPractitionerId, setSelectedPractitionerId] = useState(null);

  const navigate = useNavigate();

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  /* ---------------- FETCH DATA ---------------- */
  const fetchUnverifiedPractitioners = async () => {
  try {
    setLoading(true);
    const res = await api.get("/admin/practitioners/unverified");

    // ✅ FILTER OUT REJECTED PRACTITIONERS
    const practData = res.data.filter(
      (p) => p.rejectionReason === null
    );

    setPractitioners(practData);

    const namesMap = { ...userNames };
    await Promise.all(
      practData.map(async (p) => {
        if (p.userId && !namesMap[p.userId]) {
          try {
            const userRes = await api.get(`/users/${p.userId}`);
            namesMap[p.userId] = userRes.data.name;
          } catch {
            namesMap[p.userId] = "Unknown Practitioner";
          }
        }
      })
    );
    setUserNames(namesMap);

  } catch (err) {
    setError("Failed to load practitioners. Check API connection.");
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchUnverifiedPractitioners();
  }, []);

  /* ---------------- ACTIONS ---------------- */
  const verifyPractitioner = async (id) => {
    try {
      await api.put(`/admin/practitioner/${id}/verify`);
      setPractitioners((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Verification failed");
    }
  };

  const rejectPractitioner = (id) => {
    setSelectedPractitionerId(id);
    setShowRejectModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA]">
        <div className="w-12 h-12 border-4 border-[#1B3C53] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="tracking-widest uppercase text-[11px] font-bold text-[#1B3C53]">Loading Ledger...</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-6 md:p-12 bg-[#FAFAFA] text-[#1B3C53] font-sans">

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-dashed border-[#1B3C53]/20 pb-10 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-10 h-1 bg-[#FF004D]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF004D]">Control Panel</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic">
            PENDING<span className="text-blue-500">AUTH</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-5 py-2 bg-white rounded-full border shadow-sm">
            <ShieldCheck className="text-blue-500" size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Administrator</span>
          </div>
          <button onClick={handleLogout} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Grid */}
      <div className="mt-12">
        {practitioners.length === 0 ? (
          <div className="text-center py-20 opacity-30">
            <CheckCircle size={80} className="mx-auto mb-4" />
            <h2 className="text-3xl font-black uppercase italic">Queue Empty</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {practitioners.map((p) => (
              <div key={p.id} className="bg-white border-2 border-gray-100 p-8 rounded-[40px] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-blue-500 text-white px-4 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter mb-2">
                      User ID: #{p.userId}
                    </div>
                    <span className="text-[11px] font-bold text-gray-400">
                      {p.certificateSubmittedAt ? new Date(p.certificateSubmittedAt).toLocaleDateString() : 'Date Missing'}
                    </span>
                  </div>

                  {/* UPDATED: Practitioner Name retrieved via userId */}
                  <h3 className="text-4xl font-black uppercase italic mb-2 text-[#1B3C53]">
                    {userNames[p.userId] || "Loading Name..."}
                  </h3>
                  
                  {/* Sub-header with specialization */}
                  <p className="text-blue-600 font-bold uppercase text-xs mb-4 tracking-widest">
                    Expertise: {p.specialization}
                  </p>
                  
                  <p className="text-gray-500 italic text-sm mb-6 leading-relaxed">
                    "{p.bio || "No biography provided by applicant."}"
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wide">
                      <span className="w-2 h-2 rounded-full bg-[#FF004D]" />
                      Status: <span className="text-[#FF004D]">Pending Review</span>
                    </div>
                  </div>

                  {/* CERTIFICATE LINK SECTION */}
                  <div className="bg-[#FAFAFA] border-2 border-dashed border-gray-200 p-5 rounded-3xl mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="text-blue-500" />
                        <div>
                          <p className="text-[10px] font-black uppercase text-gray-400">Credential Link</p>
                          <p className="text-xs font-bold">Certification Document</p>
                        </div>
                      </div>
                      {p.certificateLink ? (
                        <a
                          href={p.certificateLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                        >
                          <ExternalLink size={18} />
                        </a>
                      ) : (
                        <span className="text-[10px] font-bold text-red-400 uppercase">No Link</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button
                    onClick={() => verifyPractitioner(p.id)}
                    className="py-4 bg-[#1B3C53] text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest hover:bg-blue-900 transition-all shadow-lg"
                  >
                    Verify & Approve
                  </button>
                  <button
                    onClick={() => rejectPractitioner(p.id)}
                    className="py-4 border-2 border-[#FF004D] text-[#FF004D] rounded-2xl font-bold uppercase text-[11px] tracking-widest hover:bg-[#FF004D] hover:text-white transition-all"
                  >
                    Reject Application
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showRejectModal && (
        <RejectPractitionerModal
          practitionerId={selectedPractitionerId}
          onClose={() => setShowRejectModal(false)}
          onSuccess={fetchUnverifiedPractitioners}
        />
      )}
    </div>
  );
}
