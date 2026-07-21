import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please enter both email and password"); return; }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data?.accessToken;
      const role  = res.data?.role;
      if (!token || !role) throw new Error("Invalid login response");

      localStorage.setItem("token", token);
      localStorage.setItem("role",  role);

      if (role === "ADMIN") {
        refreshCart();
        navigate("/admin", { replace: true });
        return;
      }

      const userRes = await api.get("/users/me");
      const user = userRes.data;
      localStorage.setItem("user", JSON.stringify(user));

      if (role === "PRACTITIONER") {
        try {
          const practitionerRes = await api.get(`/practitioners/user/${user.id}`);
          const practitionerRaw = practitionerRes.data;
          const practitioner = {
            id: practitionerRaw.id, userId: user.id,
            name: user.name, email: user.email,
            specialization: practitionerRaw.specialization,
            bio: practitionerRaw.bio,
            clinicAddress: practitionerRaw.clinicAddress,
            verified: practitionerRaw.verified,
            rating: practitionerRaw.rating,
            certificateLink: practitionerRaw.certificateLink,
            rejectionReason: practitionerRaw.rejectionReason,
          };
          localStorage.setItem("practitioner", JSON.stringify(practitioner));
          refreshCart();
          navigate(practitioner.verified ? "/practitioner/home" : "/dashboard", { replace: true });
        } catch {
          refreshCart();
          navigate("/dashboard", { replace: true });
        }
        return;
      }

      refreshCart();
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };



  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/google", { credential: credentialResponse.credential });
      const token = res.data?.accessToken;
      const role  = res.data?.role;
      if (!token || !role) throw new Error("Invalid Google login response");

      localStorage.setItem("token", token);
      localStorage.setItem("role",  role);

      if (role === "ADMIN") {
        refreshCart();
        navigate("/admin", { replace: true });
        return;
      }

      const userRes = await api.get("/users/me");
      const user = userRes.data;
      localStorage.setItem("user", JSON.stringify(user));

      if (role === "PRACTITIONER") {
        try {
          const practitionerRes = await api.get(`/practitioners/user/${user.id}`);
          const practitionerRaw = practitionerRes.data;
          const practitioner = {
            id: practitionerRaw.id, userId: user.id,
            name: user.name, email: user.email,
            specialization: practitionerRaw.specialization,
            bio: practitionerRaw.bio,
            clinicAddress: practitionerRaw.clinicAddress,
            verified: practitionerRaw.verified,
            rating: practitionerRaw.rating,
            certificateLink: practitionerRaw.certificateLink,
            rejectionReason: practitionerRaw.rejectionReason,
          };
          localStorage.setItem("practitioner", JSON.stringify(practitioner));
          refreshCart();
          navigate(practitioner.verified ? "/practitioner/home" : "/dashboard", { replace: true });
        } catch {
          refreshCart();
          navigate("/dashboard", { replace: true });
        }
        return;
      }

      refreshCart();
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* ── LEFT: FORM PANEL ── */}
      <div className="w-full lg:w-[42%] flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100">
        <div className="w-full max-w-md">

          {/* Back to Home */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 mb-8 transition-colors font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            Back to Home
          </button>

          {/* Brand */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xl shadow-lg">
              🌿
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">Wellnest</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Welcome back</h1>
            <p className="text-sm text-slate-500">Sign in to continue your wellness journey.</p>
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

          {/* Form */}
          <form className="space-y-4" onSubmit={loginUser}>
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all bg-white placeholder:text-slate-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500">Password</label>
                <Link to="/forgot-password" className="text-[11px] font-bold text-teal-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all bg-white placeholder:text-slate-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-widest hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : "Sign In"}
            </button>
          </form>

          {/* ── OR Divider ── */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* ── Google Sign-In Button ── */}
          <div className="w-full">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError("Google Sign-In was cancelled or failed.")}
              width="100%"
              theme="outline"
              shape="rectangular"
              text="signin_with"
              logo_alignment="left"
            />
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-teal-600 font-black hover:underline underline-offset-2">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* ── RIGHT: IMAGE PANEL ── */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1400&q=80"
          className="w-full h-full object-cover"
          alt="Wellness"
        />
        {/* Overlay quote */}
        <div className="absolute bottom-12 left-12 right-12 bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
          <p className="text-white text-xl font-black italic leading-snug">
            "Healing is not a destination,<br />it's a daily practice."
          </p>
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-3">Wellnest Philosophy</p>
        </div>
      </div>
    </div>
  );
}
