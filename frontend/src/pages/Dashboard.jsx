import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  User,
  FileText,
  MapPin,
  ChevronRight,
  CheckCircle,
  Upload,
  X,
  Loader2,
  Stethoscope,
} from "lucide-react";

const specializationsOptions = [
  { value: "physiotherapy", label: "Physiotherapy", icon: "🦴" },
  { value: "acupuncture", label: "Acupuncture", icon: "🪡" },
  { value: "ayurveda", label: "Ayurveda", icon: "🌿" },
  { value: "chiropractic", label: "Chiropractic", icon: "🧘" },
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [bio, setBio] = useState("");
  const [specialization, setSpecialization] = useState(specializationsOptions[0].value);
  const [clinicAddress, setClinicAddress] = useState("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [driveLink, setDriveLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  /* ================= FETCH USER ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        const userData = res.data;
        setUser(userData);
        setBio(userData.bio || "");

        if (userData.role === "PRACTITIONER") {
          const practitionerRes = await api.get(`/practitioners/user/${userData.id}`);
          const practitionerData = practitionerRes.data;
          setBio(practitionerData.bio || "");
          setSpecialization(practitionerData.specialization || specializationsOptions[0].value);
          setClinicAddress(practitionerData.clinicAddress || "");
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  /* ================= SUBMITS ================= */
  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.put(`/users/${user.id}`, { bio });
      showSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/home"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePractitionerSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.put(`/practitioners/user/${user.id}`, { bio, specialization, clinicAddress });
      showSuccess("Profile updated successfully!");
      setTimeout(() => navigate("/practitioner/home"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save practitioner profile.");
    } finally {
      setSaving(false);
    }
  };

  /* ================= CERTIFICATE UPLOAD ================= */
  const handleCertificateUpload = async () => {
    if (!driveLink.trim()) {
      setUploadError("Please paste a valid Google Drive link.");
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
      const res = await api.post(`/practitioners/user/${user.id}/upload-certificate`, {
        driveLink,
      });
      setUploadSuccess(res.data.message || "Documents submitted for review!");
      setTimeout(() => {
        setShowUploadModal(false);
        setDriveLink("");
        setUploadSuccess("");
      }, 2000);
    } catch (err) {
      setUploadError(err.response?.data?.message || "Failed to upload documents.");
    } finally {
      setUploading(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-5" />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
          Setting up your space…
        </p>
      </div>
    );
  }

  if (!user) return null;

  const { name, email, role } = user;
  const isPractitioner = role === "PRACTITIONER";

  return (
    <div className="min-h-screen flex bg-white relative">
      {/* Success toast */}
      {successMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-emerald-600 text-white px-6 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle size={16} />
          {successMsg}
        </div>
      )}

      {/* ── LEFT: FORM PANEL ── */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 overflow-y-auto">
        <div className="w-full max-w-md py-10">

          {/* Brand */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xl shadow-lg">
              🌿
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">
              Wellnest
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
              Complete your profile
            </h1>
            <p className="text-sm text-slate-500">
              {isPractitioner
                ? "Set up your practitioner profile to start accepting bookings."
                : "Tell us a bit about yourself to personalize your experience."}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm flex items-start gap-2">
              <X size={14} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <form
            onSubmit={isPractitioner ? handlePractitionerSubmit : handlePatientSubmit}
            className="space-y-5"
          >
            {/* Read-only user info */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">
                Full Name
              </label>
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-100 text-sm font-medium text-slate-500">
                <User size={14} className="text-slate-400" />
                {name}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">
                Email
              </label>
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-100 text-sm font-medium text-slate-500">
                <FileText size={14} className="text-slate-400" />
                {email}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">
                {isPractitioner ? "Professional Bio" : "About You"}
              </label>
              <textarea
                rows="4"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all bg-white placeholder:text-slate-300 resize-none"
                placeholder={
                  isPractitioner
                    ? "Describe your expertise, approach to healing, and experience…"
                    : "Tell us about your wellness goals…"
                }
              />
            </div>

            {/* Practitioner-specific fields */}
            {isPractitioner && (
              <>
                {/* Clinic Address */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">
                    Clinic Address
                  </label>
                  <div className="relative">
                    <MapPin
                      size={14}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={clinicAddress}
                      onChange={(e) => setClinicAddress(e.target.value)}
                      placeholder="e.g. 12 Wellness Lane, Bandra West, Mumbai"
                      className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all bg-white placeholder:text-slate-300"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 pl-1">
                    This is shown to patients when they book sessions.
                  </p>
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                    Specialization
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {specializationsOptions.map((spec) => (
                      <button
                        key={spec.value}
                        type="button"
                        onClick={() => setSpecialization(spec.value)}
                        className={`flex items-center gap-2 p-3.5 rounded-2xl border-2 transition-all text-left ${
                          specialization === spec.value
                            ? "border-teal-500 bg-teal-50 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <span className="text-lg">{spec.icon}</span>
                        <span
                          className={`text-xs font-black uppercase tracking-widest ${
                            specialization === spec.value
                              ? "text-teal-700"
                              : "text-slate-700"
                          }`}
                        >
                          {spec.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Verification Status */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                    Verification
                  </label>
                  <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                        <Stethoscope size={14} className="text-amber-600" />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-amber-800">
                          Pending Verification
                        </p>
                        <p className="text-[10px] text-amber-600 mt-0.5">
                          Upload your certificates to get verified
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-amber-700 transition-all"
                    >
                      <Upload size={12} />
                      Upload
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-widest hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 mt-2"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  Save Profile
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ── RIGHT: HERO PANEL ── */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-[#0f172a]">
        <img
          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=80"
          className="w-full h-full object-cover opacity-40"
          alt="Wellness"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-16">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="w-8 h-0.5 bg-teal-400" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-teal-400">
                {isPractitioner ? "Practitioner Onboarding" : "Wellness Profile"}
              </span>
            </div>
            <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
              Your Journey<br />
              <span className="text-teal-400">Begins Here</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              isPractitioner ? "Manage your therapy services" : "Book therapy sessions",
              isPractitioner ? "Accept patient bookings" : "Explore wellness products",
              isPractitioner ? "Grow your practice" : "Get AI-powered health insights",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle size={14} className="text-teal-400" />
                </div>
                <p className="text-white/80 text-sm font-medium">{item}</p>
              </div>
            ))}

            <div className="mt-8 p-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10">
              <p className="text-white text-base font-black italic leading-snug">
                &ldquo;A healthy outside starts from the inside.&rdquo;
              </p>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-2">
                Wellnest Philosophy
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== UPLOAD MODAL ===== */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden">
            {/* Modal header */}
            <div className="p-8 pb-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Upload Certificate</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Share a Google Drive link to your credentials.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadError("");
                    setUploadSuccess("");
                  }}
                  className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X size={18} className="text-slate-500" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-4">
              {uploadError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm flex items-start gap-2">
                  <X size={14} className="mt-0.5 shrink-0" />
                  {uploadError}
                </div>
              )}

              {uploadSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-sm flex items-center gap-2">
                  <CheckCircle size={14} className="shrink-0" />
                  {uploadSuccess}
                </div>
              )}

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                  Google Drive Link
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/..."
                  value={driveLink}
                  onChange={(e) => setDriveLink(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all bg-white placeholder:text-slate-300"
                />
                <p className="text-[10px] text-slate-400 mt-1.5 pl-1">
                  Make sure the link is publicly accessible or shared with the admin email.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadError("");
                  }}
                  className="flex-1 py-3.5 rounded-2xl border-2 border-slate-200 text-slate-700 font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCertificateUpload}
                  disabled={uploading || !!uploadSuccess}
                  className="flex-1 py-3.5 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-widest hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Submitting…
                    </>
                  ) : (
                    <>
                      <Upload size={14} /> Submit
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}