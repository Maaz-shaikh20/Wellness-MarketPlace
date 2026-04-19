import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PATIENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const signupUser = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // ✅ FIXED ENDPOINT
      await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      // ✅ BACKEND DOES NOT RETURN TOKEN — THIS IS EXPECTED
      setSuccess("Account created successfully. Please login.");

      // ✅ Redirect to login after short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* LEFT FORM */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-4 bg-gradient-to-br from-cyan-50 to-blue-200">
        <div className="w-full max-w-lg border-4 border-teal-400/70 shadow-2xl rounded-xl p-6 lg:p-8 bg-white/95 backdrop-blur-sm space-y-5 max-h-[95vh] lg:max-h-[90vh]">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Create Your Wellness Account 🌱
            </h2>
            <p className="text-sm text-slate-500">Tell us a bit about yourself</p>
          </div>

          {error && (
            <div className="p-2 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="p-2 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded">
              {success}
            </div>
          )}

          <form className="space-y-3" onSubmit={signupUser}>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:ring-1 focus:ring-teal-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:ring-1 focus:ring-teal-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:ring-1 focus:ring-teal-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <select
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="PATIENT">Patient</option>
              <option value="PRACTITIONER">Practitioner</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-3 rounded-lg text-white font-bold shadow-md transition 
              ${loading ? "bg-teal-400 cursor-not-allowed" : "bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"}`}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="text-center pt-1 text-sm">
            <p className="text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-teal-600 font-bold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="hidden lg:block lg:w-3/5 relative bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-blue-600/20 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=1920&auto=format&fit=crop"
          alt="Wellness"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-12 text-white">
          <h2 className="text-3xl font-bold mb-2">
            Wellness Marketplace For Alternate Therapies
          </h2>
          <p className="text-lg text-teal-50 opacity-90">
            “Well-being is more than care — it’s a mindful lifestyle shaped by the
            wisdom of your body, the clarity of your mind, and the peace of your spirit.”
          </p>
        </div>
      </div>
    </div>
  );
}
