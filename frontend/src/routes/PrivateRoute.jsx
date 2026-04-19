import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const location = useLocation();

  let token = null;
  let user = null;

  try {
    token = localStorage.getItem("token");
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (err) {
    console.warn("❌ Failed to parse user from localStorage:", err);
    // Clear corrupted data
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  const isAuthenticated = !!token && !!user;

  if (!isAuthenticated) {
    console.warn("➡️ PrivateRoute: Not authenticated, redirecting to /login", {
      path: location.pathname,
      token,
      user,
    });

    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // ✅ Authenticated → render children
  return children;
}
