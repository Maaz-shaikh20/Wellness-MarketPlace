import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const roles = [
  {
    value: "PATIENT",
    label: "Patient",
    icon: "🧘",
    desc: "Book therapies, explore products & track your wellness journey.",
  },
  {
    value: "PRACTITIONER",
    label: "Practitioner",
    icon: "🩺",
    desc: "Offer therapy sessions, manage products & grow your practice.",
  },
];

export default function Signup() {
  const navigate = useNavigate();
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [role,     setRole]     = useState("PATIENT");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");

  const signupUser = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/auth/register", { name, email, password, role });
      setSuccess("Account created! Redirecting to login…");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all bg-white placeholder:text-slate-300";

  return (
    <div className="min-h-screen flex bg-white">

      {/* ── LEFT: FORM PANEL ── */}
      <div className="w-full lg:w-[42%] flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 overflow-y-auto">
        <div className="w-full max-w-md py-8">

          {/* Brand */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xl shadow-lg">
              🌿
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">Wellnest</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Create your account</h1>
            <p className="text-sm text-slate-500">Begin your wellness journey today.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 text-sm flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={signupUser}>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="Jane Smith"
                autoComplete="name"
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                autoComplete="new-password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Role selector — card style */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">I am a…</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                      role === r.value
                        ? "border-teal-500 bg-teal-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <span className="text-xl">{r.icon}</span>
                    <p className={`text-xs font-black uppercase tracking-widest mt-2 ${role === r.value ? "text-teal-700" : "text-slate-700"}`}>
                      {r.label}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 leading-snug">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !!success}
              className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-widest hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating Account…
                </>
              ) : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-600 font-black hover:underline underline-offset-2">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* ── RIGHT: IMAGE PANEL ── */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=80"
          className="w-full h-full object-cover"
          alt="Wellness"
        />
        {/* dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

        {/* Role hint cards */}
        <div className="absolute bottom-12 left-12 right-12 space-y-3">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <p className="text-white text-xl font-black italic leading-snug">
              "Your journey to wellness<br />begins with a single step."
            </p>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-3">Join thousands of Wellnest members</p>
          </div>
        </div>
      </div>
    </div>
  );
}
