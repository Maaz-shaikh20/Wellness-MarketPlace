import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1️⃣ LOGIN
      const res = await api.post("/auth/login", { email, password });

      const token = res.data?.accessToken;
      const role = res.data?.role;

      if (!token || !role) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // 2️⃣ ADMIN
      if (role === "ADMIN") {
        navigate("/admin", { replace: true });
        return;
      }

      // 3️⃣ FETCH LOGGED-IN USER (SOURCE OF NAME & EMAIL)
      const userRes = await api.get("/users/me");
      const user = userRes.data;

      localStorage.setItem("user", JSON.stringify(user));

      // 4️⃣ PRACTITIONER FLOW (🔥 FIX IS HERE)
      if (role === "PRACTITIONER") {
        try {
          const practitionerRes = await api.get(
            `/practitioners/user/${user.id}`
          );

          const practitionerRaw = practitionerRes.data;

          // ✅ BUILD COMPLETE PRACTITIONER OBJECT
          const practitioner = {
            id: practitionerRaw.id,
            userId: user.id,
            name: user.name,
            email: user.email,
            specialization: practitionerRaw.specialization,
            bio: practitionerRaw.bio,
            clinicAddress: practitionerRaw.clinicAddress,
            verified: practitionerRaw.verified,
            rating: practitionerRaw.rating,
            certificateLink: practitionerRaw.certificateLink,
            rejectionReason: practitionerRaw.rejectionReason,
          };

          localStorage.setItem(
            "practitioner",
            JSON.stringify(practitioner)
          );

          // ✅ VERIFIED PRACTITIONER
          if (practitioner.verified === true) {
            navigate("/practitioner/home", { replace: true });
            return;
          }

          // ⛔ UNVERIFIED PRACTITIONER
          navigate("/dashboard", { replace: true });
          return;

        } catch (err) {
          console.error("Practitioner fetch failed", err);
          navigate("/dashboard", { replace: true });
          return;
        }
      }

      // 5️⃣ NORMAL USER
      navigate("/home", { replace: true });

    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="w-full lg:w-2/5 flex items-center justify-center p-6 bg-gradient-to-br from-cyan-50 to-blue-200">
        <div className="w-full max-w-lg border-4 border-teal-400/70 shadow-2xl rounded-xl p-8 bg-white space-y-7">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold">
              Login to Wellnest 🧘‍♀️
            </h2>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={loginUser}>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg border"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-teal-600 font-bold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:block lg:w-3/5">
        <img
          src="https://images.unsplash.com/photo-1545205597-3d9d02c29597"
          className="w-full h-full object-cover"
          alt="Wellness"
        />
      </div>
    </div>
  );
}
