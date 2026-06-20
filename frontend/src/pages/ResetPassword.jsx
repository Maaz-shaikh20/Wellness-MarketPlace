import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeft, CheckCircle, Lock } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Reset token is missing from the link. Please request a new one.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Reset token is missing. Please request a new link.");
      return;
    }
    if (!password.trim() || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/auth/reset-password", { token, password });
      setSuccess(res.data?.message || "Your password has been successfully reset!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. The link may have expired or is invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* ── LEFT: FORM PANEL ── */}
      <div className="w-full lg:w-[42%] flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          
          {/* Back to Login */}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 mb-8 transition-colors font-semibold"
          >
            <ArrowLeft size={14} /> Back to Login
          </button>

          {/* Brand */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xl shadow-lg">🌿</div>
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">Wellnest</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Reset Password</h1>
            <p className="text-sm text-slate-500">Create a secure new password for your Wellnest account.</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm flex items-start gap-2.5 animate-in fade-in duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {success ? (
            <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle size={22} className="text-emerald-600" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-extrabold text-slate-900 font-sans">Success!</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-sans">
                  {success}
                </p>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal pt-2 font-sans animate-pulse">
                🔄 Redirecting you to the login screen…
              </p>
            </div>
          ) : (
            /* Form */
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="password"
                    required
                    disabled={!token}
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all bg-white placeholder:text-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input
                    type="password"
                    required
                    disabled={!token}
                    placeholder="Verify new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all bg-white placeholder:text-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-widest hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 mt-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Resetting…
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-slate-500 mt-8">
            Back to{" "}
            <Link to="/login" className="text-teal-600 font-black hover:underline underline-offset-2">Log In</Link>
          </p>
        </div>
      </div>

      {/* ── RIGHT: IMAGE PANEL ── */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-slate-950">
        <img
          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=80"
          className="w-full h-full object-cover opacity-45"
          alt="Wellness Background"
        />
        <div className="absolute bottom-12 left-12 right-12 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
          <p className="text-white text-xl font-black italic leading-snug">
            "Your journey to wellness<br />is built on trust and security."
          </p>
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-3">Wellnest Support & Security</p>
        </div>
      </div>
    </div>
  );
}
